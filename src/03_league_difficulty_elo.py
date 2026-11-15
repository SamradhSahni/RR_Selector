"""
src/03_league_difficulty_elo.py
Orthogonal Zero-Centered Fixed Effects, Elite Matchup Flags & LOMO Shrunk Quality Wicket Par
"""
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.linear_model import Ridge
from sklearn.preprocessing import OneHotEncoder

PROC_DIR = Path("data/processed")

def estimate_competition_and_player_latents() -> None:
    """
    Fits an orthogonal Ridge Fixed-Effects model across batter-faced deliveries:
        E[Bowler_Runs] = mu + alpha_batter - beta_bowler + gamma_comp + delta_venue + tau_phase
    1. Zero-centers alpha_batter, beta_bowler, and gamma_comp across deliveries (zero double-counting).
    2. Flags Top-Quartile (Top 25%) Elite Bowlers and Elite Batters for high-pressure matchup dominance.
    3. Computes Leave-One-Match-Out (LOMO) Empirical Bayes shrunk quality wicket expectation per (venue, phase).
    """
    bbb = pd.read_parquet(PROC_DIR / "bbb_enriched.parquet")
    for col in ["striker_id", "bowler_id", "competition_id", "venue", "phase"]:
        bbb[col] = bbb[col].astype(str)

    bat_balls = bbb.groupby("striker_id")["is_batter_ball"].sum()
    bowl_balls = bbb.groupby("bowler_id")["is_legal_ball"].sum()
    valid_bats = set(bat_balls[bat_balls >= 60].index)
    valid_bowls = set(bowl_balls[bowl_balls >= 60].index)

    bbb["striker_fe"] = np.where(bbb["striker_id"].isin(valid_bats), bbb["striker_id"], "OTHER_BAT")
    bbb["bowler_fe"] = np.where(bbb["bowler_id"].isin(valid_bowls), bbb["bowler_id"], "OTHER_BOWL")

    fit_mask = bbb["is_batter_ball"] == 1
    fit_df = bbb.loc[fit_mask, ["striker_fe", "bowler_fe", "competition_id", "venue", "phase"]]
    feature_cols = ["striker_fe", "bowler_fe", "competition_id", "venue", "phase"]

    ohe = OneHotEncoder(sparse_output=True, handle_unknown="ignore")
    X = ohe.fit_transform(fit_df)
    feature_names = ohe.get_feature_names_out(feature_cols)

    y = bbb.loc[fit_mask, "bowler_runs"].values.astype(float)

    print(f"[03_league_difficulty_elo] Fitting Ridge model on {len(fit_df)} deliveries with {X.shape[1]} features...")
    ridge = Ridge(alpha=140.0, solver="lsqr", random_state=42)
    ridge.fit(X, y)
    coefs = pd.Series(ridge.coef_, index=feature_names)

    bat_latent = coefs[coefs.index.str.startswith("striker_fe_")].rename(lambda c: c.replace("striker_fe_", ""))
    bowl_latent = (-coefs[coefs.index.str.startswith("bowler_fe_")]).rename(lambda c: c.replace("bowler_fe_", ""))
    comp_fe = coefs[coefs.index.str.startswith("competition_id_")].rename(lambda c: c.replace("competition_id_", ""))

    bbb["batter_latent_alpha"] = bbb["striker_fe"].map(bat_latent).fillna(0.0)
    bbb["bowler_latent_beta"] = bbb["bowler_fe"].map(bowl_latent).fillna(0.0)
    bbb["comp_env_gamma"] = bbb["competition_id"].map(comp_fe).fillna(0.0)

    # Strictly zero-center player latents and competition environment across deliveries
    bbb["batter_latent_alpha"] -= bbb.loc[fit_mask, "batter_latent_alpha"].mean()
    bbb["bowler_latent_beta"] -= bbb.loc[fit_mask, "bowler_latent_beta"].mean()
    bbb["comp_env_gamma"] -= bbb.loc[fit_mask, "comp_env_gamma"].mean()

    # Flag Top-Quartile (Top 25%) Elite Bowlers and Elite Batters for High-Pressure Matchup Dominance
    bowl_q75 = float(np.percentile(bbb.loc[bbb["is_legal_ball"] == 1, "bowler_latent_beta"], 75))
    bat_q75 = float(np.percentile(bbb.loc[bbb["is_batter_ball"] == 1, "batter_latent_alpha"], 75))
    bbb["is_elite_bowler_faced"] = (bbb["bowler_latent_beta"] >= bowl_q75).astype(int)
    bbb["is_elite_batter_bowled"] = (bbb["batter_latent_alpha"] >= bat_q75).astype(int)

    # Competition Strength Reporting Table (anchored to highest-volume benchmark = 1.00)
    comp_quality = (
        bbb.groupby("competition_id")
        .agg(
            mean_bowler_beta=("bowler_latent_beta", "mean"),
            mean_batter_alpha=("batter_latent_alpha", "mean"),
            comp_env_gamma=("comp_env_gamma", "first"),
            total_deliveries=("is_legal_ball", "sum"),
        )
        .reset_index()
    )
    comp_quality["raw_strength"] = 0.55 * comp_quality["mean_bowler_beta"] + 0.45 * comp_quality["mean_batter_alpha"]
    benchmark_idx = comp_quality["total_deliveries"].idxmax()
    benchmark_strength = comp_quality.loc[benchmark_idx, "raw_strength"]
    strength_std = max(comp_quality["raw_strength"].std(), 1e-6)
    comp_quality["difficulty_multiplier"] = (
        1.00 + 0.12 * ((comp_quality["raw_strength"] - benchmark_strength) / strength_std)
    ).clip(0.80, 1.15)

    bbb = bbb.merge(comp_quality[["competition_id", "difficulty_multiplier"]], on="competition_id", how="left")

    # Additive Context-Adjusted Expected Runs (using orthogonal comp_env_gamma, zero double-counting)
    bbb["xR_bat_context"] = np.clip(
        bbb["venue_phase_par_bat_rpb"] - bbb["bowler_latent_beta"] + bbb["comp_env_gamma"],
        0.15,
        3.00,
    )
    bbb["raaa_ball"] = bbb["runs_off_bat"] - (bbb["xR_bat_context"] * bbb["is_batter_ball"])

    bbb["xR_bowl_context"] = np.clip(
        bbb["venue_phase_par_bowl_rpb"] + bbb["batter_latent_alpha"] + bbb["comp_env_gamma"],
        0.15,
        3.00,
    )
    pos_weight = np.select(
        [
            bbb["dismissed_batting_pos"].isin([1, 2, 3]),
            bbb["dismissed_batting_pos"].isin([4, 5, 6]),
            bbb["dismissed_batting_pos"] == 7,
        ],
        [1.35, 1.15, 0.95],
        default=0.55,
    )
    bbb["quality_wicket_weight"] = bbb["is_bowler_wicket"] * pos_weight * np.exp(bbb["batter_latent_alpha"])

    # Fix #27 (v4 #4): Leave-One-Match-Out (LOMO) Empirical Bayes Shrunk Quality Wicket Par per (venue, phase)
    global_qwkt_par = (
        bbb.groupby("phase")[["quality_wicket_weight", "is_legal_ball"]]
        .sum()
        .assign(g_qwkt_pb=lambda d: d["quality_wicket_weight"] / np.maximum(1, d["is_legal_ball"]))["g_qwkt_pb"]
        .to_dict()
    )
    vp_qwkt_tot = (
        bbb.groupby(["venue", "phase"])[["quality_wicket_weight", "is_legal_ball"]]
        .sum()
        .reset_index()
        .rename(columns={"quality_wicket_weight": "v_qwkt", "is_legal_ball": "v_balls"})
    )
    mp_qwkt_tot = (
        bbb.groupby(["match_id", "venue", "phase"])[["quality_wicket_weight", "is_legal_ball"]]
        .sum()
        .reset_index()
        .rename(columns={"quality_wicket_weight": "m_qwkt", "is_legal_ball": "m_balls"})
    )
    lomo_qwkt = mp_qwkt_tot.merge(vp_qwkt_tot, on=["venue", "phase"], how="left")
    lomo_qwkt["g_qwkt_pb"] = lomo_qwkt["phase"].map(lambda ph: global_qwkt_par.get(ph, 0.055))
    lomo_qwkt["venue_phase_par_qwkt_pb"] = (
        (lomo_qwkt["v_qwkt"] - lomo_qwkt["m_qwkt"]) + 240.0 * lomo_qwkt["g_qwkt_pb"]
    ) / (np.maximum(0, lomo_qwkt["v_balls"] - lomo_qwkt["m_balls"]) + 240.0)

    bbb = bbb.merge(
        lomo_qwkt[["match_id", "venue", "phase", "venue_phase_par_qwkt_pb"]],
        on=["match_id", "venue", "phase"],
        how="left",
    )
    bbb["venue_phase_par_qwkt_pb"] = bbb["venue_phase_par_qwkt_pb"].fillna(0.055)

    bbb["waaa_ball"] = (
        (bbb["xR_bowl_context"] * bbb["is_legal_ball"] - bbb["bowler_runs"])
        + 6.2 * (bbb["quality_wicket_weight"] - bbb["venue_phase_par_qwkt_pb"] * bbb["is_legal_ball"])
    )

    bbb.to_parquet(PROC_DIR / "bbb_calibrated.parquet", index=False)
    comp_quality.to_csv(PROC_DIR / "competition_difficulty_table.csv", index=False)
    print("[03_league_difficulty_elo] Saved zero-centered player latents, LOMO quality-wicket par & calibrated RAAA/WAAA.")

if __name__ == "__main__":
    estimate_competition_and_player_latents()

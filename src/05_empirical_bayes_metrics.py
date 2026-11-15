"""
src/05_empirical_bayes_metrics.py
Scale-Matched LBMO, Outer-Joined Non-Striker Run-Outs, Legal-Ball F6/F10 Filter,
Non-Penalizing Cross-Format Synergy & 13 Micro-Parameters
"""
import numpy as np
import pandas as pd
from pathlib import Path

PROC_DIR = Path("data/processed")

def estimate_true_empirical_kappa(
    player_df: pd.DataFrame,
    rate_col: str,
    exposure_col: str,
    delivery_within_var: float,
    default_kappa: float = 80.0,
) -> float:
    sub = player_df[player_df[exposure_col] >= 35].copy()
    if len(sub) < 20:
        return default_kappa
    n_vals = sub[exposure_col].values.astype(float)
    rates = sub[rate_col].values.astype(float)

    n_harmonic = len(n_vals) / np.sum(1.0 / n_vals)
    obs_var = np.average((rates - np.average(rates, weights=n_vals)) ** 2, weights=n_vals)
    sampling_noise = delivery_within_var / n_harmonic
    between_var = max(obs_var - sampling_noise, obs_var * 0.15, 1e-5)

    kappa = float(np.clip(delivery_within_var / between_var, 45.0, 210.0))
    return kappa

def empirical_bayes_shrink(obs: pd.Series, exposure: pd.Series, prior: float, kappa: float) -> pd.Series:
    n = exposure.fillna(0.0).astype(float)
    w = n / (n + kappa)
    return w * obs.fillna(prior).astype(float) + (1.0 - w) * prior

def compute_pressure_and_baseline_rankings() -> None:
    bbb = pd.read_parquet(PROC_DIR / "bbb_with_wpa_pressure.parquet")
    players = pd.read_parquet(PROC_DIR / "player_master.parquet")

    bbb["striker_id"] = bbb["striker_id"].astype(str)
    bbb["non_striker_id"] = bbb["non_striker_id"].astype(str)
    bbb["bowler_id"] = bbb["bowler_id"].astype(str)
    players["player_id"] = players["player_id"].astype(str)

    bbb = bbb.merge(
        players[["player_id", "bowler_category"]].rename(columns={"player_id": "bowler_id"}),
        on="bowler_id",
        how="left",
    )
    bbb["bowler_category"] = bbb["bowler_category"].fillna("PACE")

    bbb["par_bat_runs_ball"] = bbb["venue_phase_par_bat_rpb"] * bbb["is_batter_ball"]
    bbb["par_bowl_runs_ball"] = bbb["venue_phase_par_bowl_rpb"] * bbb["is_legal_ball"]

    bbb["w_raaa_ball"] = bbb["raaa_ball"] * bbb["recency_weight"]
    bbb["w_waaa_ball"] = bbb["waaa_ball"] * bbb["recency_weight"]
    bbb["w_bat_wpa_ball"] = bbb["batter_wpa_ball"] * bbb["recency_weight"]
    bbb["w_ns_wpa_ball"] = bbb["non_striker_wpa_ball"] * bbb["recency_weight"]
    bbb["w_bowl_wpa_ball"] = bbb["bowler_wpa_ball"] * bbb["recency_weight"]
    bbb["w_bat_exposure"] = bbb["is_batter_ball"] * bbb["recency_weight"]
    bbb["w_bowl_exposure"] = bbb["is_legal_ball"] * bbb["recency_weight"]
    bbb["opp_bowl_weighted"] = bbb["bowler_latent_beta"] * bbb["is_batter_ball"]
    bbb["opp_bat_weighted"] = bbb["batter_latent_alpha"] * bbb["is_legal_ball"]

    bat_within_var = float(bbb.loc[bbb["is_batter_ball"] == 1, "raaa_ball"].var())
    bowl_within_var = float(bbb.loc[bbb["is_legal_ball"] == 1, "waaa_ball"].var())

    # ==========================================
    # PART A: BATTER PRESSURE & BASELINE METRICS
    # ==========================================
    def agg_batter_slice(df_slice: pd.DataFrame, prefix: str) -> pd.DataFrame:
        grp = (
            df_slice.groupby("striker_id")
            .agg(
                balls=("is_batter_ball", "sum"),
                w_balls=("w_bat_exposure", "sum"),
                runs=("runs_off_bat", "sum"),
                striker_outs=("is_striker_dismissed", "sum"),
                raaa_sum=("w_raaa_ball", "sum"),
                wpa_sum=("w_bat_wpa_ball", "sum"),
                fours=("is_four", "sum"),
                sixes=("is_six", "sum"),
                boundaries=("is_boundary", "sum"),
                rotations=("is_strike_rotation", "sum"),
                dots=("is_dot_bat", "sum"),
                par_runs=("par_bat_runs_ball", "sum"),
                opp_bowl_sum=("opp_bowl_weighted", "sum"),
                matches=("match_id", "nunique"),
            )
            .reset_index()
            .rename(columns={"striker_id": "player_id"})
        )
        # Fix #17 & Enhancement #34: Outer-join Non-Striker Run-Outs and Run-Out WPA so even 0-ball non-striker run-outs are conserved!
        ns_grp = (
            df_slice[df_slice["is_non_striker_dismissed"] == 1]
            .groupby("non_striker_id")
            .agg(ns_outs=("is_non_striker_dismissed", "sum"), ns_wpa_sum=("w_ns_wpa_ball", "sum"))
            .reset_index()
            .rename(columns={"non_striker_id": "player_id"})
        )
        grp = grp.merge(ns_grp, on="player_id", how="outer")
        for zero_col in [
            "balls", "w_balls", "runs", "striker_outs", "raaa_sum", "wpa_sum",
            "fours", "sixes", "boundaries", "rotations", "dots", "par_runs", "opp_bowl_sum", "matches"
        ]:
            grp[zero_col] = grp[zero_col].fillna(0.0)

        grp["dismissals"] = grp["striker_outs"] + grp["ns_outs"].fillna(0.0)
        grp["wpa_sum"] = grp["wpa_sum"] + grp["ns_wpa_sum"].fillna(0.0)

        bf = np.maximum(1.0, grp["balls"].astype(float))
        w_bf = np.maximum(1.0, grp["w_balls"].astype(float))
        non_bound_balls = np.maximum(1.0, (grp["balls"] - grp["boundaries"]).astype(float))
        non_bound_runs = grp["runs"] - 4 * grp["fours"] - 6 * grp["sixes"]

        grp[f"{prefix}_balls"] = grp["balls"]
        grp[f"{prefix}_matches"] = grp["matches"]
        grp[f"{prefix}_raw_sr"] = (grp["runs"] / bf) * 100.0
        grp[f"{prefix}_true_sr"] = ((grp["runs"] - grp["par_runs"]) / bf) * 100.0
        grp[f"{prefix}_raaa_per_ball"] = grp["raaa_sum"] / w_bf
        grp[f"{prefix}_wpa_per_100"] = (grp["wpa_sum"] / w_bf) * 100.0
        grp[f"{prefix}_dismissal_prob"] = grp["dismissals"] / bf
        grp[f"{prefix}_boundary_pct"] = (grp["boundaries"] / bf) * 100.0
        grp[f"{prefix}_dot_avoid_pct"] = (1.0 - (grp["dots"] / bf)) * 100.0
        grp[f"{prefix}_rotation_pct"] = (grp["rotations"] / non_bound_balls) * 100.0
        grp[f"{prefix}_opp_quality"] = grp["opp_bowl_sum"] / bf
        grp[f"{prefix}_nbsr"] = np.where(grp["balls"] > grp["boundaries"], (non_bound_runs / non_bound_balls) * 100.0, 75.0)
        return grp

    bat_all = agg_batter_slice(bbb, "all")
    bat_press_df = bbb[bbb["is_high_pressure_bat"] == 1]
    bat_press = agg_batter_slice(bat_press_df, "press")
    bat_base = agg_batter_slice(bbb[bbb["is_high_pressure_bat"] == 0], "base")

    # Fix #30, #31 & #34: Outer-Join Non-Striker Run-Out WPA in Match Totals & Use Unweighted Ball Exposure for Apples-to-Apples LBMO Shrinkage!
    ns_match_press = (
        bat_press_df[bat_press_df["is_non_striker_dismissed"] == 1]
        .groupby(["non_striker_id", "match_id"])["w_ns_wpa_ball"]
        .sum()
        .reset_index()
        .rename(columns={"non_striker_id": "striker_id", "w_ns_wpa_ball": "m_ns_wpa"})
    )
    bat_match_all_press = (
        bat_press_df.groupby(["striker_id", "match_id"])
        .agg(
            m_balls=("is_batter_ball", "sum"),
            m_w_balls=("w_bat_exposure", "sum"),
            m_raaa=("w_raaa_ball", "sum"),
            m_wpa=("w_bat_wpa_ball", "sum"),
        )
        .reset_index()
        .merge(ns_match_press, on=["striker_id", "match_id"], how="outer")
    )
    for zc in ["m_balls", "m_w_balls", "m_raaa", "m_wpa", "m_ns_wpa"]:
        bat_match_all_press[zc] = bat_match_all_press[zc].fillna(0.0)
    bat_match_all_press["m_wpa"] = bat_match_all_press["m_wpa"] + bat_match_all_press["m_ns_wpa"]

    best_idx_bat = bat_match_all_press.groupby("striker_id")["m_raaa"].idxmax()
    best_matches_bat = bat_match_all_press.loc[best_idx_bat, ["striker_id", "m_raaa", "m_w_balls", "m_balls"]].rename(
        columns={
            "striker_id": "player_id",
            "m_raaa": "best_match_raaa",
            "m_w_balls": "best_match_w_balls",
            "m_balls": "best_match_balls",
        }
    )
    career_press_totals_bat = (
        bat_match_all_press.groupby("striker_id")
        .agg(
            total_press_w_raaa=("m_raaa", "sum"),
            total_press_w_balls=("m_w_balls", "sum"),
            total_press_balls=("m_balls", "sum"),
        )
        .reset_index()
        .rename(columns={"striker_id": "player_id"})
    )

    bat_match_4plus = bat_match_all_press[bat_match_all_press["m_balls"] >= 4].copy()
    bat_match_4plus["is_positive_match"] = ((bat_match_4plus["m_raaa"] > 0) | (bat_match_4plus["m_wpa"] > 0.01)).astype(int)
    bat_cons = (
        bat_match_4plus.groupby("striker_id")
        .agg(
            press_innings_count=("match_id", "count"),
            pos_innings_count=("is_positive_match", "sum"),
            mean_match_raaa=("m_raaa", "mean"),
            std_match_raaa=("m_raaa", lambda s: s.std(ddof=0) if len(s) > 1 else 2.5),
        )
        .reset_index()
        .rename(columns={"striker_id": "player_id"})
    )
    bat_cons = bat_cons.merge(career_press_totals_bat, on="player_id", how="outer").merge(best_matches_bat, on="player_id", how="left")
    bat_cons["eb_pos_innings_rate"] = (bat_cons["pos_innings_count"].fillna(0) + 4 * 0.50) / (bat_cons["press_innings_count"].fillna(0) + 4)
    bat_cons["lcb_match_raaa"] = bat_cons["mean_match_raaa"].fillna(0.0) - 0.84 * (
        bat_cons["std_match_raaa"].fillna(2.5) / np.sqrt(np.maximum(1, bat_cons["press_innings_count"].fillna(1)))
    )
    lbmo_w_balls_bat = np.maximum(1.0, bat_cons["total_press_w_balls"].fillna(1.0) - bat_cons["best_match_w_balls"].fillna(0.0))
    lbmo_unweighted_balls_bat = np.maximum(0.0, bat_cons["total_press_balls"].fillna(0.0) - bat_cons["best_match_balls"].fillna(0.0))
    bat_cons["lbmo_raw_raaa_pb"] = (bat_cons["total_press_w_raaa"].fillna(0.0) - bat_cons["best_match_raaa"].fillna(0.0)) / lbmo_w_balls_bat
    bat_cons["lbmo_unweighted_balls"] = lbmo_unweighted_balls_bat

    # All 6 Batter Micro-Parameters & 3-Regime Pressure Splits
    def shrink_slice_raaa(sub_df: pd.DataFrame, col_name: str, kappa_val: float = 45.0) -> pd.DataFrame:
        g = sub_df.groupby("striker_id")[["w_raaa_ball", "w_bat_exposure"]].sum().reset_index().rename(columns={"striker_id": "player_id"})
        raw_r = g["w_raaa_ball"] / np.maximum(1.0, g["w_bat_exposure"])
        g[col_name] = empirical_bayes_shrink(raw_r, g["w_bat_exposure"], 0.0, kappa_val)
        return g[["player_id", col_name]]

    # Fix #26 (v4 #3): Filter is_batter_ball == 1 on First-6 and First-10 ball slices so wides are never included
    bat_f6_press = shrink_slice_raaa(
        bat_press_df[(bat_press_df["is_batter_ball"] == 1) & (bat_press_df["batter_ball_num_in_innings"] <= 6)],
        "eb_f6_press_raaa_pb",
        40.0,
    )
    bat_counterpunch = shrink_slice_raaa(bat_press_df[bat_press_df["wkts_last_12_balls"] >= 1], "eb_counterpunch_raaa_pb", 40.0)
    bat_vs_elite = shrink_slice_raaa(bat_press_df[bat_press_df["is_elite_bowler_faced"] == 1], "eb_vs_elite_press_raaa_pb", 45.0)
    bat_chase_press = shrink_slice_raaa(bat_press_df[bat_press_df["innings"] == 2], "eb_chase_press_raaa_pb", 45.0)
    bat_crisis = shrink_slice_raaa(bbb[bbb["is_crisis_regime_bat"] == 1], "eb_crisis_raaa_pb", 45.0)
    bat_escalation = shrink_slice_raaa(bbb[bbb["is_escalation_regime_bat"] == 1], "eb_escalation_raaa_pb", 45.0)
    bat_crunch = shrink_slice_raaa(bbb[bbb["is_crunch_regime"] == 1], "eb_crunch_raaa_pb", 45.0)

    bat_ipl_press = shrink_slice_raaa(bat_press_df[bat_press_df["is_ipl_match"] == 1], "eb_ipl_press_raaa_pb", 40.0)
    bat_t20i_press = shrink_slice_raaa(bat_press_df[bat_press_df["is_ipl_match"] == 0], "eb_t20i_press_raaa_pb", 40.0)

    # Venue-Neutral Par-Adjusted True Strike Rates for Phase, Pace/Spin & Legal First-10 Balls
    bat_ph_agg = bbb.groupby(["striker_id", "phase"])[["runs_off_bat", "par_bat_runs_ball", "is_batter_ball"]].sum().reset_index()
    bat_ph_agg["raw_tsr"] = ((bat_ph_agg["runs_off_bat"] - bat_ph_agg["par_bat_runs_ball"]) / np.maximum(1, bat_ph_agg["is_batter_ball"])) * 100.0
    bat_ph_agg["eb_tsr"] = empirical_bayes_shrink(bat_ph_agg["raw_tsr"], bat_ph_agg["is_batter_ball"], 0.0, 45.0)
    bat_phases = (
        bat_ph_agg.pivot(index="striker_id", columns="phase", values="eb_tsr")
        .fillna(0.0)
        .reset_index()
        .rename(columns={"striker_id": "player_id", "PP": "tsr_pp", "MID": "tsr_mid", "DEATH": "tsr_death"})
    )

    bat_ps_agg = bbb.groupby(["striker_id", "bowler_category"])[["runs_off_bat", "par_bat_runs_ball", "is_batter_ball"]].sum().reset_index()
    bat_ps_agg["raw_tsr"] = ((bat_ps_agg["runs_off_bat"] - bat_ps_agg["par_bat_runs_ball"]) / np.maximum(1, bat_ps_agg["is_batter_ball"])) * 100.0
    bat_ps_agg["eb_tsr"] = empirical_bayes_shrink(bat_ps_agg["raw_tsr"], bat_ps_agg["is_batter_ball"], 0.0, 45.0)
    bat_pace_spin = (
        bat_ps_agg.pivot(index="striker_id", columns="bowler_category", values="eb_tsr")
        .fillna(0.0)
        .reset_index()
        .rename(columns={"striker_id": "player_id", "PACE": "sr_vs_pace", "SPIN": "sr_vs_spin"})
    )

    f10_sub = (
        bbb[(bbb["is_batter_ball"] == 1) & (bbb["batter_ball_num_in_innings"] <= 10)]
        .groupby("striker_id")[["runs_off_bat", "par_bat_runs_ball", "is_batter_ball"]]
        .sum()
        .reset_index()
    )
    f10_sub["f10_sr"] = empirical_bayes_shrink(
        ((f10_sub["runs_off_bat"] - f10_sub["par_bat_runs_ball"]) / np.maximum(1, f10_sub["is_batter_ball"])) * 100.0,
        f10_sub["is_batter_ball"],
        0.0,
        45.0,
    )
    f10_df = f10_sub[["striker_id", "f10_sr"]].rename(columns={"striker_id": "player_id"})
    entry_df = bbb.groupby("striker_id")["over_idx"].median().reset_index(name="median_over_idx").rename(columns={"striker_id": "player_id"})

    bat_master = (
        players.merge(bat_all, on="player_id", how="inner")
        .merge(bat_press, on="player_id", how="left")
        .merge(bat_base, on="player_id", how="left")
        .merge(bat_cons, on="player_id", how="left")
        .merge(bat_f6_press, on="player_id", how="left")
        .merge(bat_counterpunch, on="player_id", how="left")
        .merge(bat_vs_elite, on="player_id", how="left")
        .merge(bat_chase_press, on="player_id", how="left")
        .merge(bat_crisis, on="player_id", how="left")
        .merge(bat_escalation, on="player_id", how="left")
        .merge(bat_crunch, on="player_id", how="left")
        .merge(bat_ipl_press, on="player_id", how="left")
        .merge(bat_t20i_press, on="player_id", how="left")
        .merge(bat_phases, on="player_id", how="left")
        .merge(bat_pace_spin, on="player_id", how="left")
        .merge(f10_df, on="player_id", how="left")
        .merge(entry_df, on="player_id", how="left")
    )

    xi_denom_bat = np.maximum(bat_master["all_matches"], bat_master["xi_matches"])
    bat_master["xi_pressure_trust_balls"] = bat_master["press_balls"].fillna(0.0) / np.maximum(1, xi_denom_bat)

    kappa_bat_raaa = estimate_true_empirical_kappa(bat_master, "press_raaa_per_ball", "press_balls", bat_within_var, 75.0)
    bat_master["eb_press_raaa_pb"] = empirical_bayes_shrink(bat_master["press_raaa_per_ball"], bat_master["press_balls"], 0.0, kappa_bat_raaa)
    bat_master["eb_base_raaa_pb"] = empirical_bayes_shrink(bat_master["base_raaa_per_ball"], bat_master["base_balls"], 0.0, kappa_bat_raaa)
    # Fix #30 (v4 #7): Shrink LBMO using the exact same kappa_bat_raaa and unweighted ball count as eb_press_raaa_pb!
    bat_master["eb_lbmo_raaa_pb"] = empirical_bayes_shrink(
        bat_master["lbmo_raw_raaa_pb"], bat_master["lbmo_unweighted_balls"], 0.0, kappa_bat_raaa
    )
    # Enhancement #37: Posterior 90% Credible Interval Half-Width on Pressure RAAA/ball (quantifies uncertainty)
    bat_master["raaa_ci90_halfwidth"] = 1.645 * np.sqrt(
        bat_within_var / (bat_master["press_balls"].fillna(0.0).astype(float) + kappa_bat_raaa)
    )

    bat_master["eb_press_tsr"] = empirical_bayes_shrink(bat_master["press_true_sr"], bat_master["press_balls"], 0.0, 80.0)
    bat_master["eb_press_wpa_100"] = empirical_bayes_shrink(bat_master["press_wpa_per_100"], bat_master["press_balls"], 0.0, 85.0)
    bat_master["eb_press_rotation_pct"] = empirical_bayes_shrink(bat_master["press_rotation_pct"], bat_master["press_balls"], 52.0, 60.0)

    prior_out_prob = float(bbb["is_team_wicket"].sum() / max(1, bbb["is_batter_ball"].sum()))
    bat_master["eb_press_out_prob"] = empirical_bayes_shrink(bat_master["press_dismissal_prob"], bat_master["press_balls"], prior_out_prob, 145.0)
    bat_master["eb_press_avg"] = ((135.0 + bat_master["eb_press_tsr"]) / 100.0) / np.maximum(0.015, bat_master["eb_press_out_prob"])

    n_press_b = bat_master["press_balls"].fillna(0.0).astype(float)
    n_base_b = np.maximum(1.0, bat_master["base_balls"].fillna(1.0).astype(float))
    n_eff_bat = (n_press_b * n_base_b) / (n_press_b + n_base_b)
    raw_clutch_diff_bat = bat_master["press_raaa_per_ball"].fillna(0.0) - np.maximum(-0.05, bat_master["eb_base_raaa_pb"])
    bat_master["eb_clutch_delta_raaa"] = empirical_bayes_shrink(raw_clutch_diff_bat, n_eff_bat, 0.0, 65.0)

    for c in [
        "eb_f6_press_raaa_pb", "eb_counterpunch_raaa_pb", "eb_vs_elite_press_raaa_pb",
        "eb_chase_press_raaa_pb", "eb_crisis_raaa_pb", "eb_escalation_raaa_pb",
        "eb_crunch_raaa_pb", "eb_ipl_press_raaa_pb", "eb_t20i_press_raaa_pb"
    ]:
        bat_master[c] = bat_master[c].fillna(0.0)

    # Fix #32 (v4 #9): Non-Penalizing Cross-Format Synergy Bonus (Retains 100% of IPL-only stars + rewards dual-format!)
    bat_master["cross_format_bonus_bat"] = np.where(
        (bat_master["eb_ipl_press_raaa_pb"] > 0.0) & (bat_master["eb_t20i_press_raaa_pb"] > 0.0),
        np.maximum(bat_master["eb_ipl_press_raaa_pb"], bat_master["eb_t20i_press_raaa_pb"])
        + 0.20 * np.minimum(bat_master["eb_ipl_press_raaa_pb"], bat_master["eb_t20i_press_raaa_pb"]),
        bat_master["eb_ipl_press_raaa_pb"] + bat_master["eb_t20i_press_raaa_pb"],
    )
    rot_norm_bat = (bat_master["eb_press_rotation_pct"] - 52.0) / 100.0
    bat_master["micro_skill_press_bat"] = (
        0.25 * bat_master["eb_vs_elite_press_raaa_pb"]
        + 0.20 * bat_master["eb_counterpunch_raaa_pb"]
        + 0.20 * bat_master["eb_f6_press_raaa_pb"]
        + 0.15 * bat_master["eb_chase_press_raaa_pb"]
        + 0.10 * rot_norm_bat
        + 0.10 * bat_master["cross_format_bonus_bat"]
    )

    # ==========================================
    # PART B: BOWLER PRESSURE & BASELINE METRICS
    # ==========================================
    def agg_bowler_slice(df_slice: pd.DataFrame, prefix: str) -> pd.DataFrame:
        grp = (
            df_slice.groupby("bowler_id")
            .agg(
                balls=("is_legal_ball", "sum"),
                w_balls=("w_bowl_exposure", "sum"),
                runs=("bowler_runs", "sum"),
                wickets=("is_bowler_wicket", "sum"),
                stump_wkts=("is_stump_attack_wkt", "sum"),
                q_wickets=("quality_wicket_weight", "sum"),
                waaa_sum=("w_waaa_ball", "sum"),
                wpa_sum=("w_bowl_wpa_ball", "sum"),
                dots=("is_dot_bowl", "sum"),
                boundaries=("is_boundary", "sum"),
                extras_conceded=("is_bowler_extra", "sum"),
                par_runs=("par_bowl_runs_ball", "sum"),
                opp_bat_sum=("opp_bat_weighted", "sum"),
                matches=("match_id", "nunique"),
            )
            .reset_index()
            .rename(columns={"bowler_id": "player_id"})
        )
        bb = np.maximum(1.0, grp["balls"].astype(float))
        w_bb = np.maximum(1.0, grp["w_balls"].astype(float))
        wkts_denom = np.maximum(1.0, grp["wickets"].astype(float))

        grp[f"{prefix}_balls"] = grp["balls"]
        grp[f"{prefix}_matches"] = grp["matches"]
        grp[f"{prefix}_wickets"] = grp["wickets"]
        grp[f"{prefix}_raw_econ"] = (grp["runs"] / bb) * 6.0
        grp[f"{prefix}_true_econ"] = ((grp["par_runs"] - grp["runs"]) / bb) * 6.0
        grp[f"{prefix}_waaa_per_ball"] = grp["waaa_sum"] / w_bb
        grp[f"{prefix}_wpa_per_100"] = (grp["wpa_sum"] / w_bb) * 100.0
        grp[f"{prefix}_wkt_prob"] = grp["wickets"] / bb
        grp[f"{prefix}_stump_attack_share"] = (grp["stump_wkts"] / wkts_denom) * 100.0
        grp[f"{prefix}_qwkt_per_24"] = (grp["q_wickets"] / bb) * 24.0
        grp[f"{prefix}_dot_pct"] = (grp["dots"] / bb) * 100.0
        grp[f"{prefix}_bound_suppress_pct"] = (1.0 - (grp["boundaries"] / bb)) * 100.0
        grp[f"{prefix}_discipline_pct"] = (1.0 - (grp["extras_conceded"] / (bb + grp["extras_conceded"]))) * 100.0
        grp[f"{prefix}_opp_quality"] = grp["opp_bat_sum"] / bb
        return grp

    bowl_all = agg_bowler_slice(bbb, "all")
    bowl_press_df = bbb[bbb["is_high_pressure_bowl"] == 1]
    bowl_press = agg_bowler_slice(bowl_press_df, "press")
    bowl_base = agg_bowler_slice(bbb[bbb["is_high_pressure_bowl"] == 0], "base")

    # Fix #16 & #30: Exact Leave-Best-Match-Out (LBMO) for Bowlers with Unweighted Ball Exposure for Shrinkage!
    bowl_match_all_press = (
        bowl_press_df.groupby(["bowler_id", "match_id"])
        .agg(
            m_balls=("is_legal_ball", "sum"),
            m_w_balls=("w_bowl_exposure", "sum"),
            m_waaa=("w_waaa_ball", "sum"),
            m_wpa=("w_bowl_wpa_ball", "sum"),
        )
        .reset_index()
    )
    best_idx_bowl = bowl_match_all_press.groupby("bowler_id")["m_waaa"].idxmax()
    best_matches_bowl = bowl_match_all_press.loc[best_idx_bowl, ["bowler_id", "m_waaa", "m_w_balls", "m_balls"]].rename(
        columns={
            "bowler_id": "player_id",
            "m_waaa": "best_match_waaa",
            "m_w_balls": "best_match_w_balls",
            "m_balls": "best_match_balls",
        }
    )
    career_press_totals_bowl = (
        bowl_match_all_press.groupby("bowler_id")
        .agg(
            total_press_w_waaa=("m_waaa", "sum"),
            total_press_w_balls=("m_w_balls", "sum"),
            total_press_balls=("m_balls", "sum"),
        )
        .reset_index()
        .rename(columns={"bowler_id": "player_id"})
    )

    bowl_match_4plus = bowl_match_all_press[bowl_match_all_press["m_balls"] >= 4].copy()
    bowl_match_4plus["is_positive_match"] = ((bowl_match_4plus["m_waaa"] > 0) | (bowl_match_4plus["m_wpa"] > 0.01)).astype(int)
    bowl_cons = (
        bowl_match_4plus.groupby("bowler_id")
        .agg(
            press_Overs_matches=("match_id", "count"),
            pos_matches_count=("is_positive_match", "sum"),
            mean_match_waaa=("m_waaa", "mean"),
            std_match_waaa=("m_waaa", lambda s: s.std(ddof=0) if len(s) > 1 else 2.5),
        )
        .reset_index()
        .rename(columns={"bowler_id": "player_id"})
    )
    bowl_cons = bowl_cons.merge(career_press_totals_bowl, on="player_id", how="outer").merge(best_matches_bowl, on="player_id", how="left")
    bowl_cons["eb_pos_match_rate"] = (bowl_cons["pos_matches_count"].fillna(0) + 4 * 0.50) / (bowl_cons["press_Overs_matches"].fillna(0) + 4)
    bowl_cons["lcb_match_waaa"] = bowl_cons["mean_match_waaa"].fillna(0.0) - 0.84 * (
        bowl_cons["std_match_waaa"].fillna(2.5) / np.sqrt(np.maximum(1, bowl_cons["press_Overs_matches"].fillna(1)))
    )
    lbmo_w_balls_bowl = np.maximum(1.0, bowl_cons["total_press_w_balls"].fillna(1.0) - bowl_cons["best_match_w_balls"].fillna(0.0))
    lbmo_unweighted_balls_bowl = np.maximum(0.0, bowl_cons["total_press_balls"].fillna(0.0) - bowl_cons["best_match_balls"].fillna(0.0))
    bowl_cons["lbmo_raw_waaa_pb"] = (bowl_cons["total_press_w_waaa"].fillna(0.0) - bowl_cons["best_match_waaa"].fillna(0.0)) / lbmo_w_balls_bowl
    bowl_cons["lbmo_unweighted_balls"] = lbmo_unweighted_balls_bowl

    # All 7 Bowler Micro-Parameters & 3-Regime Pressure Splits
    over_press = (
        bowl_press_df.groupby(["bowler_id", "match_id", "innings", "over_idx"])
        .agg(o_balls=("is_legal_ball", "sum"), o_runs=("bowler_runs", "sum"), o_par=("par_bowl_runs_ball", "sum"))
        .reset_index()
    )
    over_press = over_press[over_press["o_balls"] >= 4]
    over_press["is_controlled_over"] = (over_press["o_runs"] <= np.maximum(11.0, over_press["o_par"] + 2.5)).astype(int)
    blowup_df = (
        over_press.groupby("bowler_id")
        .agg(press_overs=("is_controlled_over", "count"), controlled_overs=("is_controlled_over", "sum"))
        .reset_index()
        .rename(columns={"bowler_id": "player_id"})
    )
    blowup_df["eb_blowup_avoid_pct"] = ((blowup_df["controlled_overs"] + 5 * 0.72) / (blowup_df["press_overs"] + 5)) * 100.0

    def shrink_slice_waaa(sub_df: pd.DataFrame, col_name: str, kappa_val: float = 45.0) -> pd.DataFrame:
        g = sub_df.groupby("bowler_id")[["w_waaa_ball", "w_bowl_exposure"]].sum().reset_index().rename(columns={"bowler_id": "player_id"})
        raw_w = g["w_waaa_ball"] / np.maximum(1.0, g["w_bowl_exposure"])
        g[col_name] = empirical_bayes_shrink(raw_w, g["w_bowl_exposure"], 0.0, kappa_val)
        return g[["player_id", col_name]]

    bowl_bounceback = shrink_slice_waaa(bowl_press_df[bowl_press_df["prev_ball_is_boundary"] == 1], "eb_bounceback_waaa_pb", 40.0)
    bowl_part_breaker = shrink_slice_waaa(bowl_press_df[bowl_press_df["partnership_runs_before"] >= 30], "eb_part_breaker_waaa_pb", 45.0)
    bowl_vs_elite = shrink_slice_waaa(bowl_press_df[bowl_press_df["is_elite_batter_bowled"] == 1], "eb_vs_elite_press_waaa_pb", 45.0)
    bowl_defend_press = shrink_slice_waaa(bowl_press_df[bowl_press_df["innings"] == 2], "eb_defend_press_waaa_pb", 45.0)
    bowl_crisis = shrink_slice_waaa(bbb[bbb["is_crisis_regime_bowl"] == 1], "eb_crisis_waaa_pb", 45.0)
    bowl_escalation = shrink_slice_waaa(bbb[bbb["is_escalation_regime_bowl"] == 1], "eb_escalation_waaa_pb", 45.0)
    bowl_crunch = shrink_slice_waaa(bbb[bbb["is_crunch_regime"] == 1], "eb_crunch_waaa_pb", 45.0)
    bowl_ipl_press = shrink_slice_waaa(bowl_press_df[bowl_press_df["is_ipl_match"] == 1], "eb_ipl_press_waaa_pb", 40.0)
    bowl_t20i_press = shrink_slice_waaa(bowl_press_df[bowl_press_df["is_ipl_match"] == 0], "eb_t20i_press_waaa_pb", 40.0)

    bowl_ph_agg = bbb.groupby(["bowler_id", "phase"])[["par_bowl_runs_ball", "bowler_runs", "is_legal_ball"]].sum().reset_index()
    bowl_ph_agg["raw_tecon"] = ((bowl_ph_agg["par_bowl_runs_ball"] - bowl_ph_agg["bowler_runs"]) / np.maximum(1, bowl_ph_agg["is_legal_ball"])) * 6.0
    bowl_ph_agg["eb_tecon"] = empirical_bayes_shrink(bowl_ph_agg["raw_tecon"], bowl_ph_agg["is_legal_ball"], 0.0, 45.0)
    bowl_phases = (
        bowl_ph_agg.pivot(index="bowler_id", columns="phase", values="eb_tecon")
        .fillna(0.0)
        .reset_index()
        .rename(columns={"bowler_id": "player_id", "PP": "tecon_pp", "MID": "tecon_mid", "DEATH": "tecon_death"})
    )

    bowl_master = (
        players.merge(bowl_all, on="player_id", how="inner")
        .merge(bowl_press, on="player_id", how="left")
        .merge(bowl_base, on="player_id", how="left")
        .merge(bowl_cons, on="player_id", how="left")
        .merge(blowup_df[["player_id", "eb_blowup_avoid_pct"]], on="player_id", how="left")
        .merge(bowl_bounceback, on="player_id", how="left")
        .merge(bowl_part_breaker, on="player_id", how="left")
        .merge(bowl_vs_elite, on="player_id", how="left")
        .merge(bowl_defend_press, on="player_id", how="left")
        .merge(bowl_crisis, on="player_id", how="left")
        .merge(bowl_escalation, on="player_id", how="left")
        .merge(bowl_crunch, on="player_id", how="left")
        .merge(bowl_ipl_press, on="player_id", how="left")
        .merge(bowl_t20i_press, on="player_id", how="left")
        .merge(bowl_phases, on="player_id", how="left")
    )

    xi_denom_bowl = np.maximum(bowl_master["all_matches"], bowl_master["xi_matches"])
    bowl_master["xi_pressure_trust_balls"] = bowl_master["press_balls"].fillna(0.0) / np.maximum(1, xi_denom_bowl)

    kappa_bowl_waaa = estimate_true_empirical_kappa(bowl_master, "press_waaa_per_ball", "press_balls", bowl_within_var, 85.0)
    bowl_master["eb_press_waaa_pb"] = empirical_bayes_shrink(bowl_master["press_waaa_per_ball"], bowl_master["press_balls"], 0.0, kappa_bowl_waaa)
    bowl_master["eb_base_waaa_pb"] = empirical_bayes_shrink(bowl_master["base_waaa_per_ball"], bowl_master["base_balls"], 0.0, kappa_bowl_waaa)
    # Fix #30 (v4 #7): Shrink Bowler LBMO using the exact same kappa_bowl_waaa and unweighted ball count as eb_press_waaa_pb!
    bowl_master["eb_lbmo_waaa_pb"] = empirical_bayes_shrink(
        bowl_master["lbmo_raw_waaa_pb"], bowl_master["lbmo_unweighted_balls"], 0.0, kappa_bowl_waaa
    )
    # Enhancement #37: Posterior 90% Credible Interval Half-Width on Pressure WAAA/ball
    bowl_master["waaa_ci90_halfwidth"] = 1.645 * np.sqrt(
        bowl_within_var / (bowl_master["press_balls"].fillna(0.0).astype(float) + kappa_bowl_waaa)
    )

    bowl_master["eb_press_tecon"] = empirical_bayes_shrink(bowl_master["press_true_econ"], bowl_master["press_balls"], 0.0, 85.0)
    bowl_master["eb_press_wpa_100"] = empirical_bayes_shrink(bowl_master["press_wpa_per_100"], bowl_master["press_balls"], 0.0, 90.0)
    bowl_master["eb_blowup_avoid_pct"] = bowl_master["eb_blowup_avoid_pct"].fillna(72.0)
    bowl_master["eb_press_discipline_pct"] = empirical_bayes_shrink(bowl_master["press_discipline_pct"], bowl_master["press_balls"], 95.5, 60.0)
    # Enhancement #36: Stump-Attacking / Yorker Execution Share under pressure
    prior_stump_share = float((bbb["is_stump_attack_wkt"].sum() / max(1, bbb["is_bowler_wicket"].sum())) * 100.0)
    bowl_master["eb_stump_attack_pct"] = empirical_bayes_shrink(
        bowl_master["press_stump_attack_share"], bowl_master["press_wickets"], prior_stump_share, 12.0
    )

    prior_wkt_prob = float(bbb["is_bowler_wicket"].sum() / max(1, bbb["is_legal_ball"].sum()))
    bowl_master["eb_press_wkt_prob"] = empirical_bayes_shrink(bowl_master["press_wkt_prob"], bowl_master["press_balls"], prior_wkt_prob, 140.0)
    bowl_master["eb_press_bsr"] = 1.0 / np.maximum(0.015, bowl_master["eb_press_wkt_prob"])

    n_press_bw = bowl_master["press_balls"].fillna(0.0).astype(float)
    n_base_bw = np.maximum(1.0, bowl_master["base_balls"].fillna(1.0).astype(float))
    n_eff_bowl = (n_press_bw * n_base_bw) / (n_press_bw + n_base_bw)
    raw_clutch_diff_bowl = bowl_master["press_waaa_per_ball"].fillna(0.0) - np.maximum(-0.05, bowl_master["eb_base_waaa_pb"])
    bowl_master["eb_clutch_delta_waaa"] = empirical_bayes_shrink(raw_clutch_diff_bowl, n_eff_bowl, 0.0, 65.0)

    for c in [
        "eb_bounceback_waaa_pb", "eb_part_breaker_waaa_pb", "eb_vs_elite_press_waaa_pb",
        "eb_defend_press_waaa_pb", "eb_crisis_waaa_pb", "eb_escalation_waaa_pb",
        "eb_crunch_waaa_pb", "eb_ipl_press_waaa_pb", "eb_t20i_press_waaa_pb"
    ]:
        bowl_master[c] = bowl_master[c].fillna(0.0)

    # Fix #32 (v4 #9): Non-Penalizing Cross-Format Synergy Bonus for Bowlers
    bowl_master["cross_format_bonus_bowl"] = np.where(
        (bowl_master["eb_ipl_press_waaa_pb"] > 0.0) & (bowl_master["eb_t20i_press_waaa_pb"] > 0.0),
        np.maximum(bowl_master["eb_ipl_press_waaa_pb"], bowl_master["eb_t20i_press_waaa_pb"])
        + 0.20 * np.minimum(bowl_master["eb_ipl_press_waaa_pb"], bowl_master["eb_t20i_press_waaa_pb"]),
        bowl_master["eb_ipl_press_waaa_pb"] + bowl_master["eb_t20i_press_waaa_pb"],
    )
    disc_norm_bowl = (bowl_master["eb_press_discipline_pct"] - 95.5) / 25.0
    stump_norm_bowl = (bowl_master["eb_stump_attack_pct"] - prior_stump_share) / 100.0
    bowl_master["micro_skill_press_bowl"] = (
        0.22 * bowl_master["eb_vs_elite_press_waaa_pb"]
        + 0.22 * bowl_master["eb_part_breaker_waaa_pb"]
        + 0.18 * bowl_master["eb_bounceback_waaa_pb"]
        + 0.15 * bowl_master["eb_defend_press_waaa_pb"]
        + 0.08 * stump_norm_bowl
        + 0.08 * disc_norm_bowl
        + 0.07 * bowl_master["cross_format_bonus_bowl"]
    )

    bat_master.to_parquet(PROC_DIR / "batter_pressure_metrics.parquet", index=False)
    bowl_master.to_parquet(PROC_DIR / "bowler_pressure_metrics.parquet", index=False)
    print(f"[05_empirical_bayes_metrics] Saved full metrics + 13 micro-parameters (kappa_bat={kappa_bat_raaa:.1f}, kappa_bowl={kappa_bowl_waaa:.1f}).")

if __name__ == "__main__":
    compute_pressure_and_baseline_rankings()

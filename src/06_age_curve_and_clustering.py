"""
src/06_age_curve_and_clustering.py
Enforced Substantive >= 4-Ball Pressure Matches, Micro-Skill Pillars,
Monte Carlo Stability & Pro-Comps
"""
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.covariance import LedoitWolf
from sklearn.mixture import GaussianMixture
from sklearn.decomposition import PCA

PROC_DIR = Path("data/processed")

def robust_sigmoid_scale(s: pd.Series) -> pd.Series:
    vals = s.fillna(s.median() if len(s.dropna()) > 0 else 0.0).astype(float)
    med = np.median(vals)
    iqr = np.percentile(vals, 75) - np.percentile(vals, 25)
    robust_std = max(iqr / 1.349, np.std(vals), 1e-6)
    z = (vals - med) / robust_std
    return pd.Series(50.0 + 50.0 * np.tanh(z / 2.2), index=s.index)

def compute_mahalanobis_pro_comps(df: pd.DataFrame, feature_cols: list, score_col: str):
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0.0
        df[col] = df[col].fillna(0.0)

    X_std = StandardScaler().fit_transform(df[feature_cols].values)
    prec = LedoitWolf().fit(X_std).precision_
    top_benchmarks_idx = df[score_col].nlargest(min(15, len(df))).index.tolist()

    closest_names = []
    for i in range(len(df)):
        min_dist = float("inf")
        best_name = df["player_name"].iloc[i]
        for b_idx in top_benchmarks_idx:
            if i == b_idx:
                continue
            diff = X_std[i] - X_std[b_idx]
            dist = float(np.sqrt(np.maximum(0.0, diff @ prec @ diff.T)))
            if dist < min_dist:
                min_dist = dist
                best_name = df.loc[b_idx, "player_name"]
        closest_names.append(best_name)
    return closest_names, X_std

def run_monte_carlo_rank_stability(
    df: pd.DataFrame, p1_col: str, p2_col: str, p3_col: str, p4_col: str, n_sims: int = 500
) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    base_weights = np.array([35.0, 25.0, 20.0, 20.0])
    weights_draws = rng.dirichlet(base_weights * 1.5, size=n_sims)

    M = df[[p1_col, p2_col, p3_col, p4_col]].values
    sim_scores = M @ weights_draws.T
    sim_ranks = np.argsort(np.argsort(-sim_scores, axis=0), axis=0) + 1

    top10_prob = (sim_ranks <= 10).mean(axis=1) * 100.0
    rank_p10 = np.percentile(sim_ranks, 10, axis=1)
    rank_p90 = np.percentile(sim_ranks, 90, axis=1)
    return pd.DataFrame(
        {
            "top10_retention_pct": top10_prob,
            "rank_ci_best": rank_p10.astype(int),
            "rank_ci_worst": rank_p90.astype(int),
        },
        index=df.index,
    )

def run_clustering_and_pro_comps() -> None:
    bat_df = pd.read_parquet(PROC_DIR / "batter_pressure_metrics.parquet")
    bowl_df = pd.read_parquet(PROC_DIR / "bowler_pressure_metrics.parquet")

    min_press_bat = 40 if (bat_df["press_balls"].fillna(0) >= 40).sum() >= 25 else 25
    min_press_bowl = 40 if (bowl_df["press_balls"].fillna(0) >= 40).sum() >= 25 else 25

    # Fix #33 (v4 #10): Enforce >= 4 substantive high-pressure match appearances (with >= 4 pressure balls)
    min_substantive_bat = 4 if (bat_df["press_innings_count"].fillna(0) >= 4).sum() >= 20 else 2
    min_substantive_bowl = 4 if (bowl_df["press_Overs_matches"].fillna(0) >= 4).sum() >= 20 else 2

    bat_elig = (
        bat_df[
            (bat_df["all_balls"] >= 75)
            & (bat_df["press_balls"].fillna(0) >= min_press_bat)
            & (bat_df["press_innings_count"].fillna(0) >= min_substantive_bat)
        ]
        .copy()
        .reset_index(drop=True)
    )
    bowl_elig = (
        bowl_df[
            (bowl_df["all_balls"] >= 75)
            & (bowl_df["press_balls"].fillna(0) >= min_press_bowl)
            & (bowl_df["press_Overs_matches"].fillna(0) >= min_substantive_bowl)
        ]
        .copy()
        .reset_index(drop=True)
    )

    print(f"[06_age_curve_and_clustering] Eligible players: {len(bat_elig)} batters, {len(bowl_elig)} bowlers.")

    # 1. Batter Pillars (incorporating 6 Micro-Execution Skills, 3-Regime Robustness & Scale-Matched LBMO Resilience)
    bat_elig["s_micro"] = robust_sigmoid_scale(bat_elig["micro_skill_press_bat"])
    bat_elig["s_raaa"] = (
        0.75 * robust_sigmoid_scale(bat_elig["eb_press_raaa_pb"])
        + 0.25 * bat_elig["s_micro"]
    )
    bat_elig["s_wpa"] = robust_sigmoid_scale(bat_elig["eb_press_wpa_100"])
    bat_elig["s_delta"] = robust_sigmoid_scale(bat_elig["eb_clutch_delta_raaa"])
    bat_elig["consistency_score"] = (
        0.35 * robust_sigmoid_scale(bat_elig["eb_pos_innings_rate"])
        + 0.25 * robust_sigmoid_scale(bat_elig["lcb_match_raaa"])
        + 0.25 * robust_sigmoid_scale(bat_elig["eb_lbmo_raaa_pb"])
        + 0.15 * robust_sigmoid_scale(bat_elig["xi_pressure_trust_balls"])
    )
    bat_elig["pressure_reliability_score"] = (
        0.35 * bat_elig["s_raaa"] + 0.25 * bat_elig["s_wpa"] + 0.20 * bat_elig["s_delta"] + 0.20 * bat_elig["consistency_score"]
    )
    bat_mc = run_monte_carlo_rank_stability(bat_elig, "s_raaa", "s_wpa", "s_delta", "consistency_score")
    bat_elig = pd.concat([bat_elig, bat_mc], axis=1)

    # 2. Bowler Pillars (incorporating 7 Micro-Execution Skills, Blow-Up Avoidance & Scale-Matched LBMO Resilience)
    bowl_elig["s_micro"] = robust_sigmoid_scale(bowl_elig["micro_skill_press_bowl"])
    bowl_elig["s_waaa"] = (
        0.75 * robust_sigmoid_scale(bowl_elig["eb_press_waaa_pb"])
        + 0.25 * bowl_elig["s_micro"]
    )
    bowl_elig["s_wpa"] = robust_sigmoid_scale(bowl_elig["eb_press_wpa_100"])
    bowl_elig["s_delta"] = robust_sigmoid_scale(bowl_elig["eb_clutch_delta_waaa"])
    bowl_elig["consistency_score"] = (
        0.30 * robust_sigmoid_scale(bowl_elig["eb_pos_match_rate"])
        + 0.25 * robust_sigmoid_scale(bowl_elig["lcb_match_waaa"])
        + 0.25 * robust_sigmoid_scale(bowl_elig["eb_lbmo_waaa_pb"])
        + 0.10 * robust_sigmoid_scale(bowl_elig["eb_blowup_avoid_pct"])
        + 0.10 * robust_sigmoid_scale(bowl_elig["xi_pressure_trust_balls"])
    )
    bowl_elig["pressure_reliability_score"] = (
        0.35 * bowl_elig["s_waaa"] + 0.25 * bowl_elig["s_wpa"] + 0.20 * bowl_elig["s_delta"] + 0.20 * bowl_elig["consistency_score"]
    )
    bowl_mc = run_monte_carlo_rank_stability(bowl_elig, "s_waaa", "s_wpa", "s_delta", "consistency_score")
    bowl_elig = pd.concat([bowl_elig, bowl_mc], axis=1)

    for df in [bat_elig, bowl_elig]:
        age_vals = pd.to_numeric(df.get("age", pd.Series(25.0, index=df.index)), errors="coerce").fillna(25.0)
        df["age_clean"] = age_vals
        df["yavi_score"] = df["pressure_reliability_score"] * np.exp(0.065 * np.maximum(0.0, 24.0 - df["age_clean"]))

    bat_features = ["tsr_pp", "tsr_mid", "tsr_death", "all_boundary_pct", "all_nbsr", "f10_sr", "sr_vs_pace", "sr_vs_spin", "median_over_idx"]
    bat_elig["pro_comp_player"], X_bat_std = compute_mahalanobis_pro_comps(bat_elig, bat_features, "pressure_reliability_score")
    bat_elig["archetype_cluster"] = GaussianMixture(n_components=min(4, len(bat_elig)), random_state=42).fit_predict(X_bat_std)

    # 2D Tactical Archetype Map Coordinates (PCA 2D projection)
    pca_bat = PCA(n_components=2, random_state=42).fit_transform(X_bat_std)
    bat_elig["umap_x"], bat_elig["umap_y"] = pca_bat[:, 0], pca_bat[:, 1]

    bowl_features = ["tecon_pp", "tecon_mid", "tecon_death", "all_dot_pct", "all_bound_suppress_pct", "all_qwkt_per_24"]
    bowl_elig["pro_comp_player"], X_bowl_std = compute_mahalanobis_pro_comps(bowl_elig, bowl_features, "pressure_reliability_score")
    bowl_elig["archetype_cluster"] = GaussianMixture(n_components=min(4, len(bowl_elig)), random_state=42).fit_predict(X_bowl_std)

    pca_bowl = PCA(n_components=2, random_state=42).fit_transform(X_bowl_std)
    bowl_elig["umap_x"], bowl_elig["umap_y"] = pca_bowl[:, 0], pca_bowl[:, 1]

    bat_elig.to_parquet(PROC_DIR / "batter_clustered_rankings.parquet", index=False)
    bowl_elig.to_parquet(PROC_DIR / "bowler_clustered_rankings.parquet", index=False)
    print("[06_age_curve_and_clustering] Saved enhanced pressure rankings, 13 micro-skill pillars & Pro-Comps.")

if __name__ == "__main__":
    run_clustering_and_pro_comps()

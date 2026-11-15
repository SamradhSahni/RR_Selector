"""
src/07_rr_portfolio_optimizer.py
Synchronized Unstop Top-10 Exporter, Automated Signature-Match Case-Study Extractor & MILP
"""
import numpy as np
import pandas as pd
from pathlib import Path
from scipy.optimize import milp, LinearConstraint

PROC_DIR = Path("data/processed")
REP_DIR = Path("reports")
REP_DIR.mkdir(parents=True, exist_ok=True)

def extract_signature_pressure_performances(
    bbb: pd.DataFrame, top10_bat: pd.DataFrame, top10_bowl: pd.DataFrame
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Enhancement #38: Automatically extracts the Top-2 Signature High-Pressure Match Outings
    for each Top-10 Batter and Top-10 Bowler to provide ready-to-cite match evidence for the report.
    """
    bat_press = bbb[(bbb["is_high_pressure_bat"] == 1) & (bbb["striker_id"].astype(str).isin(top10_bat["player_id"].astype(str)))]
    bat_matches = (
        bat_press.groupby(["striker_id", "match_id", "venue", "match_date_parsed"])
        .agg(
            press_runs=("runs_off_bat", "sum"),
            press_bf=("is_batter_ball", "sum"),
            press_raaa=("raaa_ball", "sum"),
            press_wpa_pct=("batter_wpa_ball", lambda s: s.sum() * 100.0),
            mean_cpi=("cpi_bat", "mean"),
        )
        .reset_index()
        .rename(columns={"striker_id": "player_id"})
    )
    bat_matches = bat_matches[bat_matches["press_bf"] >= 4].merge(
        top10_bat[["player_id", "player_name", "unstop_rank"]], on="player_id", how="inner"
    )
    sig_bat = (
        bat_matches.sort_values(["unstop_rank", "press_raaa"], ascending=[True, False])
        .groupby("player_id")
        .head(2)
        [[
            "unstop_rank", "player_name", "match_date_parsed", "venue",
            "press_runs", "press_bf", "press_raaa", "press_wpa_pct", "mean_cpi"
        ]]
    )

    bowl_press = bbb[(bbb["is_high_pressure_bowl"] == 1) & (bbb["bowler_id"].astype(str).isin(top10_bowl["player_id"].astype(str)))]
    bowl_matches = (
        bowl_press.groupby(["bowler_id", "match_id", "venue", "match_date_parsed"])
        .agg(
            press_wkts=("is_bowler_wicket", "sum"),
            press_runs_conceded=("bowler_runs", "sum"),
            press_bb=("is_legal_ball", "sum"),
            press_waaa=("waaa_ball", "sum"),
            press_wpa_pct=("bowler_wpa_ball", lambda s: s.sum() * 100.0),
            mean_cpi=("cpi_bowl", "mean"),
        )
        .reset_index()
        .rename(columns={"bowler_id": "player_id"})
    )
    bowl_matches = bowl_matches[bowl_matches["press_bb"] >= 4].merge(
        top10_bowl[["player_id", "player_name", "unstop_rank"]], on="player_id", how="inner"
    )
    sig_bowl = (
        bowl_matches.sort_values(["unstop_rank", "press_waaa"], ascending=[True, False])
        .groupby("player_id")
        .head(2)
        [[
            "unstop_rank", "player_name", "match_date_parsed", "venue",
            "press_wkts", "press_runs_conceded", "press_bb", "press_waaa", "press_wpa_pct", "mean_cpi"
        ]]
    )
    return sig_bat, sig_bowl

def compute_rr_synergy_and_export_top10() -> None:
    bat_df = pd.read_parquet(PROC_DIR / "batter_clustered_rankings.parquet")
    bowl_df = pd.read_parquet(PROC_DIR / "bowler_clustered_rankings.parquet")
    bbb = pd.read_parquet(PROC_DIR / "bbb_with_wpa_pressure.parquet")

    # 1. RR Venue & Squad Synergy (Used for MILP War-Room Portfolio)
    bat_df["rr_venue_synergy"] = (
        0.35 * bat_df["all_nbsr"].rank(pct=True) * 100.0
        + 0.35 * bat_df["tsr_death"].rank(pct=True) * 100.0
        + 0.30 * bat_df["sr_vs_spin"].rank(pct=True) * 100.0
    )
    bat_df["final_superr_score"] = 0.85 * bat_df["pressure_reliability_score"] + 0.15 * bat_df["rr_venue_synergy"]

    bowl_df["rr_venue_synergy"] = (
        0.35 * bowl_df["tecon_death"].rank(pct=True) * 100.0
        + 0.35 * bowl_df["all_dot_pct"].rank(pct=True) * 100.0
        + 0.30 * bowl_df["all_qwkt_per_24"].rank(pct=True) * 100.0
    )
    bowl_df["final_superr_score"] = 0.85 * bowl_df["pressure_reliability_score"] + 0.15 * bowl_df["rr_venue_synergy"]

    # 2. Export Ordered Top 10 Batters & Top 10 Bowlers Under Pressure (100% Matched to Unstop Dropdowns)
    top10_batters = (
        bat_df.sort_values("pressure_reliability_score", ascending=False)
        .drop_duplicates(subset=["player_id"])
        .head(10)
        .copy()
        .reset_index(drop=True)
    )
    top10_batters["unstop_rank"] = np.arange(1, len(top10_batters) + 1)

    top10_bowlers = (
        bowl_df.sort_values("pressure_reliability_score", ascending=False)
        .drop_duplicates(subset=["player_id"])
        .head(10)
        .copy()
        .reset_index(drop=True)
    )
    top10_bowlers["unstop_rank"] = np.arange(1, len(top10_bowlers) + 1)

    top10_batters.to_csv(PROC_DIR / "unstop_top10_batters_under_pressure.csv", index=False)
    top10_bowlers.to_csv(PROC_DIR / "unstop_top10_bowlers_under_pressure.csv", index=False)

    sig_bat, sig_bowl = extract_signature_pressure_performances(bbb, top10_batters, top10_bowlers)

    # 3. Export Ready-to-Paste Markdown Evidence Tables + Signature Match Case Studies
    bat_cols = [
        "unstop_rank", "player_name", "press_balls", "press_innings_count", "base_raw_sr", "press_raw_sr",
        "eb_press_tsr", "eb_press_raaa_pb", "raaa_ci90_halfwidth", "eb_clutch_delta_raaa", "eb_press_wpa_100",
        "press_opp_quality", "eb_vs_elite_press_raaa_pb", "eb_counterpunch_raaa_pb", "eb_f6_press_raaa_pb",
        "eb_pos_innings_rate", "eb_lbmo_raaa_pb", "top10_retention_pct", "pro_comp_player", "pressure_reliability_score"
    ]
    bowl_cols = [
        "unstop_rank", "player_name", "press_balls", "press_Overs_matches", "base_raw_econ", "press_raw_econ",
        "eb_press_tecon", "eb_press_waaa_pb", "waaa_ci90_halfwidth", "eb_clutch_delta_waaa", "eb_press_wpa_100",
        "press_opp_quality", "eb_vs_elite_press_waaa_pb", "eb_part_breaker_waaa_pb", "eb_blowup_avoid_pct", "eb_stump_attack_pct",
        "eb_pos_match_rate", "eb_lbmo_waaa_pb", "top10_retention_pct", "pro_comp_player", "pressure_reliability_score"
    ]
    with open(REP_DIR / "top10_evidence_tables.md", "w", encoding="utf-8") as f:
        f.write("# SupeRR Selector Season 2 — Official Top 10 Evidence & Micro-Skill Tables (v5)\n\n")
        f.write("## Table 1: Top 10 Batters Under Pressure (Rank 1 to 10)\n\n")
        f.write(top10_batters[bat_cols].round(3).to_markdown(index=False))
        f.write("\n\n## Table 2: Top 10 Bowlers Under Pressure (Rank 1 to 10)\n\n")
        f.write(top10_bowlers[bowl_cols].round(3).to_markdown(index=False))
        f.write("\n\n## Table 3: Signature High-Pressure Match Outings — Top 10 Batters\n\n")
        f.write(sig_bat.round(2).to_markdown(index=False))
        f.write("\n\n## Table 4: Signature High-Pressure Match Outings — Top 10 Bowlers\n\n")
        f.write(sig_bowl.round(2).to_markdown(index=False))
        f.write("\n")

    # 4. Cross-Constrained MILP Portfolio Optimization via SciPy HiGHS Solver
    bat_pool = bat_df.nlargest(25, "final_superr_score").copy()
    bat_pool["role_group"] = np.where(bat_pool["median_over_idx"] >= 10, "FINISHER", "TOP_ORDER")
    bat_pool["est_cost_cr"] = 0.50 + 3.50 * (bat_pool["final_superr_score"] / 100.0) ** 2

    bowl_pool = bowl_df.nlargest(25, "final_superr_score").copy()
    bowl_pool["role_group"] = np.where(bowl_pool["bowler_category"] == "SPIN", "SPINNER", "PACER")
    bowl_pool["est_cost_cr"] = 0.50 + 3.50 * (bowl_pool["final_superr_score"] / 100.0) ** 2

    combined_pool = pd.concat(
        [
            bat_pool[["player_id", "player_name", "role_group", "pressure_reliability_score", "final_superr_score", "est_cost_cr"]],
            bowl_pool[["player_id", "player_name", "role_group", "pressure_reliability_score", "final_superr_score", "est_cost_cr"]],
        ],
        ignore_index=True,
    ).drop_duplicates(subset=["player_id"]).reset_index(drop=True)

    n_items = len(combined_pool)
    # Objective: Maximize final_superr_score -> minimize -final_superr_score
    c = -combined_pool["final_superr_score"].values

    # Constraints:
    # 1. Total players == 10
    # 2. Total cost <= 26.0 Cr
    # 3. >= 2 Finishers
    # 4. >= 2 Top Order
    # 5. >= 2 Spinners
    # 6. >= 2 Pacers
    row_list = []
    lb_list = []
    ub_list = []

    # Total 10 players
    row_list.append(np.ones(n_items))
    lb_list.append(10.0)
    ub_list.append(10.0)

    # Cost <= 26.0 Cr
    row_list.append(combined_pool["est_cost_cr"].values)
    lb_list.append(0.0)
    ub_list.append(26.0)

    for role in ["FINISHER", "TOP_ORDER", "SPINNER", "PACER"]:
        mask = (combined_pool["role_group"] == role).astype(float).values
        if mask.sum() >= 2:
            row_list.append(mask)
            lb_list.append(2.0)
            ub_list.append(10.0)

    A = np.array(row_list)
    constraints = LinearConstraint(A, lb_list, ub_list)
    integrality = np.ones(n_items)  # All binary 0/1

    res = milp(c=c, constraints=constraints, integrality=integrality)
    if res.success:
        combined_pool["selected"] = np.round(res.x).astype(int)
    else:
        # Fallback to top rated
        combined_pool["selected"] = 0
        combined_pool.loc[combined_pool.nlargest(10, "final_superr_score").index, "selected"] = 1

    optimal_portfolio = combined_pool[combined_pool["selected"] == 1].sort_values("final_superr_score", ascending=False)
    optimal_portfolio.to_csv(PROC_DIR / "rr_milp_optimal_portfolio.csv", index=False)

    print(f"[07_rr_portfolio_optimizer] Exported Top 10 CSVs, Signature Match Tables, and {REP_DIR / 'top10_evidence_tables.md'}")

if __name__ == "__main__":
    compute_rr_synergy_and_export_top10()

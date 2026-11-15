"""
notebooks/visual_generation.py
Complete 5-Figure Royals-Branded Publication Suite (With Scale-Matched LBMO Validation)
"""
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from pathlib import Path

PROC_DIR = Path("data/processed")
FIG_DIR = Path("reports/figures")
FIG_DIR.mkdir(parents=True, exist_ok=True)

RR_PINK = "#EA1A85"
RR_BLUE = "#254AA5"
RR_NAVY = "#0B132B"
RR_GOLD = "#FFD700"

def generate_report_figures() -> None:
    bbb = pd.read_parquet(PROC_DIR / "bbb_with_wpa_pressure.parquet")
    bat_df = pd.read_parquet(PROC_DIR / "batter_clustered_rankings.parquet")
    bowl_df = pd.read_parquet(PROC_DIR / "bowler_clustered_rankings.parquet")
    top10_bat = pd.read_csv(PROC_DIR / "unstop_top10_batters_under_pressure.csv")
    top10_bowl = pd.read_csv(PROC_DIR / "unstop_top10_bowlers_under_pressure.csv")

    plt.rcParams["figure.facecolor"] = RR_NAVY
    plt.rcParams["axes.facecolor"] = RR_NAVY
    plt.rcParams["text.color"] = "white"
    plt.rcParams["axes.labelcolor"] = "white"
    plt.rcParams["xtick.color"] = "white"
    plt.rcParams["ytick.color"] = "white"

    # Figure 1: Pressure Regime Empirical Validation (Proving CPI_t separates Pressure from Ordinary)
    bbb["cpi_decile"] = pd.qcut(bbb["cpi_bat"], q=10, labels=[f"D{i}" for i in range(1, 11)])
    regime_stats = (
        bbb.groupby("cpi_decile", observed=False)
        .agg(
            wkt_rate=("is_team_wicket", lambda s: s.mean() * 100.0),
            wp_swing=("wpa_ball", lambda s: np.abs(s).mean() * 100.0),
        )
        .reset_index()
    )
    fig, ax1 = plt.subplots(figsize=(11, 5.5))
    ax1.plot(regime_stats["cpi_decile"].astype(str), regime_stats["wkt_rate"], marker="o", color=RR_PINK, linewidth=2.5)
    ax1.set_xlabel("Context Pressure Index (CPI_t) Decile (D1 = Lowest, D10 = Highest Pressure)")
    ax1.set_ylabel("Dismissal Probability per Ball (%)", color=RR_PINK)
    ax2 = ax1.twinx()
    ax2.plot(regime_stats["cpi_decile"].astype(str), regime_stats["wp_swing"], marker="s", color=RR_GOLD, linewidth=2.5)
    ax2.set_ylabel("Mean Absolute Win Probability Swing (%)", color=RR_GOLD)
    plt.title("Empirical Validation of Pressure Index (CPI_t): Wicket Risk & WP Volatility by Decile", fontsize=13, fontweight="bold", color="white")
    plt.tight_layout()
    plt.savefig(FIG_DIR / "fig1_pressure_regime_validation.png", dpi=300)
    plt.close()

    # Figure 2: Top 10 Batters & Top 10 Bowlers Under Pressure Horizontal Bar Chart
    fig, axes = plt.subplots(1, 2, figsize=(16, 7))
    axes[0].barh(top10_bat["player_name"][::-1], top10_bat["pressure_reliability_score"][::-1], color=RR_PINK, edgecolor=RR_GOLD)
    axes[0].set_title("Top 10 Batters Under Pressure (SupeRR Reliability Score)", fontsize=13, fontweight="bold", color=RR_GOLD)
    axes[0].set_xlabel("Pressure Reliability Score (0-100)")

    axes[1].barh(top10_bowl["player_name"][::-1], top10_bowl["pressure_reliability_score"][::-1], color=RR_BLUE, edgecolor=RR_GOLD)
    axes[1].set_title("Top 10 Bowlers Under Pressure (SupeRR Reliability Score)", fontsize=13, fontweight="bold", color=RR_GOLD)
    axes[1].set_xlabel("Pressure Reliability Score (0-100)")
    plt.tight_layout()
    plt.savefig(FIG_DIR / "fig2_top10_batters_and_bowlers.png", dpi=300)
    plt.close()

    # Figure 3: Clutch Elevation Quadrant (Baseline vs High-Pressure Performance)
    fig, axes = plt.subplots(1, 2, figsize=(16, 6.5))
    axes[0].scatter(bat_df["eb_base_raaa_pb"], bat_df["eb_press_raaa_pb"], c=bat_df["pressure_reliability_score"], cmap="plasma", s=55, alpha=0.85)
    axes[0].axline((0, 0), slope=1, color="white", linestyle="--", alpha=0.6)
    for _, r in top10_bat.head(5).iterrows():
        axes[0].annotate(r["player_name"], (r["eb_base_raaa_pb"], r["eb_press_raaa_pb"]), color=RR_GOLD, fontsize=8.5, fontweight="bold")
    axes[0].set_title("Batters: Baseline vs. High-Pressure RAAA/Ball", color=RR_GOLD, fontweight="bold")
    axes[0].set_xlabel("Ordinary Baseline RAAA / Ball (EB)")
    axes[0].set_ylabel("High-Pressure RAAA / Ball (EB)")

    axes[1].scatter(bowl_df["eb_base_waaa_pb"], bowl_df["eb_press_waaa_pb"], c=bowl_df["pressure_reliability_score"], cmap="viridis", s=55, alpha=0.85)
    axes[1].axline((0, 0), slope=1, color="white", linestyle="--", alpha=0.6)
    for _, r in top10_bowl.head(5).iterrows():
        axes[1].annotate(r["player_name"], (r["eb_base_waaa_pb"], r["eb_press_waaa_pb"]), color=RR_GOLD, fontsize=8.5, fontweight="bold")
    axes[1].set_title("Bowlers: Baseline vs. High-Pressure WAAA/Ball", color=RR_GOLD, fontweight="bold")
    axes[1].set_xlabel("Ordinary Baseline WAAA / Ball (EB)")
    axes[1].set_ylabel("High-Pressure WAAA / Ball (EB)")
    plt.tight_layout()
    plt.savefig(FIG_DIR / "fig3_clutch_elevation_quadrants.png", dpi=300)
    plt.close()

    # Figure 4: Archetype Map
    fig, axes = plt.subplots(1, 2, figsize=(15, 6))
    axes[0].scatter(bat_df["umap_x"], bat_df["umap_y"], c=bat_df["archetype_cluster"], cmap="cool", s=50, alpha=0.85)
    axes[0].set_title("Batter Tactical Archetypes (2D Projection on Venue-Neutral Splits)", color=RR_GOLD, fontweight="bold")
    axes[1].scatter(bowl_df["umap_x"], bowl_df["umap_y"], c=bowl_df["archetype_cluster"], cmap="winter", s=50, alpha=0.85)
    axes[1].set_title("Bowler Tactical Archetypes (2D Projection on Venue-Neutral Splits)", color=RR_GOLD, fontweight="bold")
    plt.tight_layout()
    plt.savefig(FIG_DIR / "fig4_umap_gmm_archetypes.png", dpi=300)
    plt.close()

    # Figure 5: Scale-Matched Full Career vs Leave-Best-Match-Out (LBMO) Stress Test Comparison for Top 10
    fig, axes = plt.subplots(1, 2, figsize=(16, 6.5))
    y_pos_b = np.arange(len(top10_bat))
    axes[0].barh(y_pos_b + 0.18, top10_bat["eb_press_raaa_pb"][::-1], height=0.35, color=RR_PINK, label="Full Pressure RAAA/Ball (EB)")
    axes[0].barh(y_pos_b - 0.18, top10_bat["eb_lbmo_raaa_pb"][::-1], height=0.35, color=RR_GOLD, label="LBMO Stress-Test RAAA/Ball (Scale-Matched EB)")
    axes[0].set_yticks(y_pos_b)
    axes[0].set_yticklabels(top10_bat["player_name"][::-1])
    axes[0].set_title("Batters LBMO Stress Test: Removing Single Best Match", color=RR_GOLD, fontweight="bold")
    axes[0].legend()

    y_pos_bw = np.arange(len(top10_bowl))
    axes[1].barh(y_pos_bw + 0.18, top10_bowl["eb_press_waaa_pb"][::-1], height=0.35, color=RR_BLUE, label="Full Pressure WAAA/Ball (EB)")
    axes[1].barh(y_pos_bw - 0.18, top10_bowl["eb_lbmo_waaa_pb"][::-1], height=0.35, color=RR_GOLD, label="LBMO Stress-Test WAAA/Ball (Scale-Matched EB)")
    axes[1].set_yticks(y_pos_bw)
    axes[1].set_yticklabels(top10_bowl["player_name"][::-1])
    axes[1].set_title("Bowlers LBMO Stress Test: Removing Single Best Match", color=RR_GOLD, fontweight="bold")
    axes[1].legend()
    plt.tight_layout()
    plt.savefig(FIG_DIR / "fig5_lbmo_stress_test_validation.png", dpi=300)
    plt.close()

    print(f"[visual_generation] Saved all 5 publication figures to {FIG_DIR}")

if __name__ == "__main__":
    generate_report_figures()

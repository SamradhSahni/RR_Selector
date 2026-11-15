"""
src/02_external_enrichment.py
Disambiguated Player Metadata, Completed-Match Playing XI Merge & Pace/Spin Classifier
"""
import numpy as np
import pandas as pd
from pathlib import Path

PROC_DIR = Path("data/processed")
EXT_DIR = Path("data/external")
EXT_DIR.mkdir(parents=True, exist_ok=True)

def resolve_raw_dir() -> Path:
    for p in [Path("Data Pack"), Path("data/raw/Data Pack"), Path("data/raw"), Path("extracted_data/Data Pack")]:
        if (p / "competition_team_player_mapping.csv").exists():
            return p
    raise FileNotFoundError("Could not locate competition_team_player_mapping.csv")

def build_player_master_and_styles() -> pd.DataFrame:
    raw_dir = resolve_raw_dir()
    mapping = pd.read_csv(raw_dir / "competition_team_player_mapping.csv")
    teams = pd.read_csv(raw_dir / "teams.csv")
    comps = pd.read_csv(raw_dir / "competitions.csv")
    bbb = pd.read_parquet(PROC_DIR / "bbb_enriched.parquet")

    mapping["player_id"] = mapping["player_id"].astype(str)
    mapping["team_id"] = mapping["team_id"].astype(str)
    mapping["comp_id"] = mapping["comp_id"].astype(str)
    teams["team_id"] = teams["team_id"].astype(str)
    comps["comp_id"] = comps["comp_id"].astype(str)

    merged_map = (
        mapping.merge(teams[["team_id", "team_name"]].drop_duplicates(), on="team_id", how="left", suffixes=("", "_team_csv"))
        .merge(comps[["comp_id", "comp_name"]].drop_duplicates(), on="comp_id", how="left", suffixes=("", "_comp_csv"))
    )

    player_name_col = "player_name" if "player_name" in merged_map.columns else "name"
    team_name_col = "team_name" if "team_name" in merged_map.columns else "team"
    comp_name_col = "comp_name" if "comp_name" in merged_map.columns else "competition"

    player_master = (
        merged_map.groupby("player_id")
        .agg(
            player_name=(player_name_col, "first"),
            teams_played=(team_name_col, lambda s: " | ".join(sorted(set(s.dropna().astype(str))))),
            competitions_played=(comp_name_col, lambda s: " | ".join(sorted(set(s.dropna().astype(str))))),
            n_competitions=("comp_id", "nunique"),
        )
        .reset_index()
    )

    # Merge completed-match Playing XI appearances from playing_eleven.csv
    xi_path = PROC_DIR / "player_xi_counts.parquet"
    if xi_path.exists():
        xi_df = pd.read_parquet(xi_path)
        player_master = player_master.merge(xi_df, on="player_id", how="left")
    player_master["xi_matches"] = player_master.get("xi_matches", pd.Series(0, index=player_master.index)).fillna(0).astype(int)

    # Empirical Pace vs Spin Inference from delivery data
    bbb["bowler_id_str"] = bbb["bowler_id"].astype(str)
    bbb["is_stumped"] = (bbb["dismissal_type"].astype(str).str.lower().isin(["stump", "stumped"])).astype(int)
    bbb["is_noball_deliv"] = (bbb["extras_type"].astype(str).str.lower() == "overstep").astype(int)
    bbb["is_spin_deliv"] = (bbb["pace_or_spin"].astype(str).str.lower() == "spin").astype(int)

    bowler_emp = (
        bbb.groupby("bowler_id_str")
        .agg(
            total_balls=("is_legal_ball", "sum"),
            mid_balls=("phase", lambda s: (s == "MID").sum()),
            stumpings=("is_stumped", "sum"),
            noballs=("is_noball_deliv", "sum"),
            spin_deliveries=("is_spin_deliv", "sum"),
        )
        .reset_index()
        .rename(columns={"bowler_id_str": "player_id"})
    )
    bowler_emp["mid_share"] = bowler_emp["mid_balls"] / np.maximum(1, bowler_emp["total_balls"])
    bowler_emp["spin_share"] = bowler_emp["spin_deliveries"] / np.maximum(1, bowler_emp["total_balls"])
    bowler_emp["inferred_bowl_type"] = np.where(
        (bowler_emp["spin_share"] >= 0.50) | (bowler_emp["stumpings"] >= 1) | ((bowler_emp["mid_share"] >= 0.62) & (bowler_emp["noballs"] == 0)),
        "SPIN",
        "PACE",
    )

    player_master = player_master.merge(
        bowler_emp[["player_id", "inferred_bowl_type", "mid_share", "spin_share"]], on="player_id", how="left"
    )
    player_master["bowler_category"] = player_master["inferred_bowl_type"].fillna("PACE")

    out_path = PROC_DIR / "player_master.parquet"
    player_master.to_parquet(out_path, index=False)
    print(f"[02_external_enrichment] Saved {len(player_master)} disambiguated player profiles to {out_path}")
    return player_master

if __name__ == "__main__":
    build_player_master_and_styles()

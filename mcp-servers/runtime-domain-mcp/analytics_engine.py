"""
SupeRR Selector Analytics Engine: Cricket Pressure & Leverage Engine.
Evaluates ball-by-ball delivery leverage and computes baseline vs pressure metrics.
"""
import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Data Pack")

_CACHE: Dict[str, Any] = {}


def load_datasets() -> Dict[str, pd.DataFrame]:
    if "bbb" in _CACHE:
        return _CACHE

    bbb = pd.read_csv(os.path.join(DATA_DIR, "ball_by_ball.csv"))
    matches = pd.read_csv(os.path.join(DATA_DIR, "matches.csv"))
    competitions = pd.read_csv(os.path.join(DATA_DIR, "competitions.csv"))
    players = pd.read_csv(os.path.join(DATA_DIR, "competition_team_player_mapping.csv"))
    teams = pd.read_csv(os.path.join(DATA_DIR, "teams.csv"))
    p11 = pd.read_csv(os.path.join(DATA_DIR, "playing_eleven.csv"))

    # Enrich bbb with match metadata
    match_meta = matches[["match_id", "comp_id", "knock_out", "stage", "match_date"]].copy()
    match_meta = match_meta.merge(competitions[["comp_id", "match_format", "comp_name", "season"]], on="comp_id", how="left")
    bbb = bbb.merge(match_meta, on="match_id", how="left")

    # Fill NaN extras
    bbb["extras1_runs"] = bbb["extras1_runs"].fillna(0).astype(int)
    bbb["extras_2_runs"] = bbb["extras_2_runs"].fillna(0).astype(int)
    bbb["total_runs_delivery"] = bbb["runs"] + bbb["extras1_runs"] + bbb["extras_2_runs"]

    # Calculate cumulative innings runs and cumulative wickets before this ball
    bbb = bbb.sort_values(by=["match_id", "innings", "overid", "over_ball_num", "innings_ball_num"]).reset_index(drop=True)

    # Cumulative wickets
    bbb["is_wicket_int"] = bbb["is_wicket"].astype(int)
    bbb["cum_wickets"] = bbb.groupby(["match_id", "innings"])["is_wicket_int"].cumsum() - bbb["is_wicket_int"]
    bbb["cum_runs"] = bbb.groupby(["match_id", "innings"])["total_runs_delivery"].cumsum() - bbb["total_runs_delivery"]

    # Calculate balls remaining in standard 20 overs (120 legal balls)
    bbb["is_legal_ball"] = ~bbb["extras_type"].isin(["wide", "Overstep"])
    bbb["cum_legal_balls"] = bbb.groupby(["match_id", "innings"])["is_legal_ball"].cumsum() - bbb["is_legal_ball"].astype(int)
    bbb["balls_remaining"] = np.maximum(0, 120 - bbb["cum_legal_balls"])

    # Calculate Target for Innings 2 chases
    # Total score of Innings 1 per match
    inn1_totals = bbb[bbb["innings"] == 1].groupby("match_id")["total_runs_delivery"].sum().reset_index()
    inn1_totals.rename(columns={"total_runs_delivery": "inn1_final_score"}, inplace=True)
    bbb = bbb.merge(inn1_totals, on="match_id", how="left")
    bbb["target"] = bbb["inn1_final_score"] + 1

    # Overwrite target with revised_target from matches if rain-affected
    revised_targets = matches[matches["revised_target"].notnull()][["match_id", "revised_target"]]
    if len(revised_targets) > 0:
        bbb = bbb.merge(revised_targets, on="match_id", how="left")
        bbb["target"] = np.where(bbb["revised_target"].notnull(), bbb["revised_target"], bbb["target"])
        bbb.drop(columns=["revised_target"], inplace=True)

    # Required runs in Innings 2
    bbb["runs_needed"] = np.maximum(0, bbb["target"] - bbb["cum_runs"])
    bbb["rrr"] = np.where(
        (bbb["innings"] == 2) & (bbb["balls_remaining"] > 0),
        (bbb["runs_needed"] / bbb["balls_remaining"]) * 6.0,
        0.0
    )

    # Compute Pressure Leverage Score P_i in [0, 1]
    # Factor 1: Phase urgency (Powerplay early vs Middle vs Death overs 16-20)
    phase_score = np.where(bbb["overid"] >= 16, 0.40, np.where(bbb["overid"] >= 11, 0.20, 0.10))

    # Factor 2: Chase RRR pressure in Innings 2
    rrr_score = np.where(
        bbb["innings"] == 2,
        np.clip((bbb["rrr"] - 8.0) / 8.0, 0.0, 0.50),
        0.0
    )

    # Factor 3: Collapse pressure (wickets lost)
    wicket_score = np.where(
        (bbb["overid"] <= 6) & (bbb["cum_wickets"] >= 3), 0.35,
        np.where(bbb["cum_wickets"] >= 5, 0.30, bbb["cum_wickets"] * 0.04)
    )

    # Factor 4: Knockout multiplier
    knockout_boost = np.where(bbb["knock_out"] == 1, 0.15, 0.0)

    # Composite Pressure Score
    raw_pressure = phase_score + rrr_score + wicket_score + knockout_boost
    bbb["pressure_score"] = np.clip(raw_pressure, 0.0, 1.0)
    bbb["is_high_pressure"] = bbb["pressure_score"] >= 0.55

    _CACHE["bbb"] = bbb
    _CACHE["matches"] = matches
    _CACHE["competitions"] = competitions
    _CACHE["players"] = players
    _CACHE["teams"] = teams
    _CACHE["p11"] = p11
    return _CACHE


def get_player_stats(player_name: str, role: str = "all") -> List[Dict[str, Any]]:
    data = load_datasets()
    bbb = data["bbb"]
    players = data["players"]

    # Match player name
    matches = players[players["player_name"].str.contains(player_name, case=False, na=False)]["player_id"].unique()
    if len(matches) == 0:
        return []

    results = []
    for pid in matches:
        p_name = players[players["player_id"] == pid]["player_name"].iloc[0]
        # Batting
        bat_df = bbb[bbb["striker_id"] == pid]
        # Bowling
        bowl_df = bbb[bbb["bowler_id"] == pid]

        bat_balls = len(bat_df[bat_df["is_legal_ball"]])
        bat_runs = int(bat_df["runs"].sum())
        bat_sr = round((bat_runs / bat_balls * 100), 2) if bat_balls > 0 else None
        bat_dot_pct = round(((bat_df["runs"] == 0).sum() / len(bat_df) * 100), 2) if len(bat_df) > 0 else 0.0
        bat_bnd_pct = round((((bat_df["is_four"] | bat_df["is_six"]).sum()) / len(bat_df) * 100), 2) if len(bat_df) > 0 else 0.0

        bowl_balls = len(bowl_df[bowl_df["is_legal_ball"]])
        bowl_runs = int(bowl_df["runs"].sum() + bowl_df[bowl_df["extras_type"].isin(["wide", "Overstep"])]["extras1_runs"].sum())
        bowler_wickets = int(bowl_df[bowl_df["is_wicket"] & bowl_df["dismissal_type"].isin(["Caught", "Bowled", "LBW", "Stump", "Hit Wicket"])]["is_wicket"].sum())
        bowl_econ = round((bowl_runs / (bowl_balls / 6.0)), 2) if bowl_balls >= 6 else None

        results.append({
            "player_id": int(pid),
            "player_name": p_name,
            "batting": {
                "balls_faced": bat_balls,
                "runs": bat_runs,
                "strike_rate": bat_sr,
                "dot_pct": bat_dot_pct,
                "boundary_pct": bat_bnd_pct
            },
            "bowling": {
                "legal_balls": bowl_balls,
                "runs_conceded": bowl_runs,
                "wickets": bowler_wickets,
                "economy": bowl_econ
            }
        })
    return results


def get_top_pressure_players(role: str = "bat", min_balls: int = 60, limit: int = 10) -> List[Dict[str, Any]]:
    data = load_datasets()
    bbb = data["bbb"]

    if role == "bat":
        # Group by striker
        base = bbb[bbb["is_legal_ball"]].groupby(["striker_id", "striker_name"]).agg(
            total_balls=("runs", "count"),
            total_runs=("runs", "sum")
        ).reset_index()
        base["base_sr"] = (base["total_runs"] / base["total_balls"]) * 100.0

        # High pressure
        hp = bbb[bbb["is_legal_ball"] & bbb["is_high_pressure"]].groupby(["striker_id", "striker_name"]).agg(
            hp_balls=("runs", "count"),
            hp_runs=("runs", "sum"),
            hp_fours=("is_four", "sum"),
            hp_sixes=("is_six", "sum"),
            hp_dots=("runs", lambda x: (x == 0).sum()),
            hp_dismissals=("is_wicket", "sum")
        ).reset_index()
        hp["hp_sr"] = (hp["hp_runs"] / hp["hp_balls"]) * 100.0
        hp["hp_bnd_pct"] = ((hp["hp_fours"] + hp["hp_sixes"]) / hp["hp_balls"]) * 100.0
        hp["hp_dot_pct"] = (hp["hp_dots"] / hp["hp_balls"]) * 100.0

        merged = hp.merge(base, on=["striker_id", "striker_name"])
        merged = merged[merged["hp_balls"] >= min_balls].copy()

        # Clutch differential: elevation above player's standard baseline
        merged["clutch_diff"] = merged["hp_sr"] - merged["base_sr"]

        # Composite Resilience Score (SR + Differential + Boundary Power - Dot Penalty)
        # Bayesian credibility weight on sample size
        n = merged["hp_balls"]
        k = 50.0
        weight = n / (n + k)
        merged["resilience_score"] = round(weight * (merged["hp_sr"] * 0.5 + merged["clutch_diff"] * 0.3 + merged["hp_bnd_pct"] * 1.5 - merged["hp_dot_pct"] * 0.5), 2)
        top = merged.sort_values(by="resilience_score", ascending=False).head(limit)

        return [
            {
                "rank": idx + 1,
                "player_id": int(row["striker_id"]),
                "player_name": row["striker_name"],
                "hp_balls": int(row["hp_balls"]),
                "hp_runs": int(row["hp_runs"]),
                "hp_sr": round(row["hp_sr"], 2),
                "base_sr": round(row["base_sr"], 2),
                "clutch_diff": round(row["clutch_diff"], 2),
                "resilience_score": float(row["resilience_score"])
            }
            for idx, (_, row) in enumerate(top.iterrows())
        ]
    else:
        # Bowling
        legal_bbb = bbb[bbb["is_legal_ball"]].copy()
        legal_bbb["bowler_runs"] = legal_bbb["runs"]
        # Add extras conceded by bowler
        wides_noballs = bbb[bbb["extras_type"].isin(["wide", "Overstep"])].groupby(["match_id", "innings", "overid", "over_ball_num"])["extras1_runs"].sum().reset_index()

        base = legal_bbb.groupby(["bowler_id", "bowler_name"]).agg(
            total_balls=("runs", "count"),
            total_runs=("runs", "sum")
        ).reset_index()
        base["base_econ"] = (base["total_runs"] / (base["total_balls"] / 6.0))

        hp = bbb[bbb["is_high_pressure"]].groupby(["bowler_id", "bowler_name"]).agg(
            hp_balls=("is_legal_ball", "sum"),
            hp_runs=("runs", "sum"),
            hp_wickets=("is_wicket", lambda w: (w & bbb.loc[w.index, "dismissal_type"].isin(["Caught", "Bowled", "LBW", "Stump", "Hit Wicket"])).sum()),
            hp_dots=("runs", lambda x: (x == 0).sum())
        ).reset_index()
        hp["hp_econ"] = (hp["hp_runs"] / (hp["hp_balls"] / 6.0))
        hp["hp_dot_pct"] = (hp["hp_dots"] / hp["hp_balls"]) * 100.0

        merged = hp.merge(base, on=["bowler_id", "bowler_name"])
        merged = merged[merged["hp_balls"] >= min_balls].copy()

        # Clutch Economy Differential: how much lower economy is under pressure vs baseline
        merged["econ_diff"] = merged["base_econ"] - merged["hp_econ"]

        n = merged["hp_balls"]
        k = 50.0
        weight = n / (n + k)
        # Bowler resilience score: higher is better (rewarding low economy, high wickets, dots)
        merged["resilience_score"] = round(weight * ((14.0 - merged["hp_econ"]) * 5.0 + merged["econ_diff"] * 4.0 + (merged["hp_wickets"] / (merged["hp_balls"] / 6.0)) * 10.0 + merged["hp_dot_pct"] * 0.4), 2)
        top = merged.sort_values(by="resilience_score", ascending=False).head(limit)

        return [
            {
                "rank": idx + 1,
                "player_id": int(row["bowler_id"]),
                "player_name": row["bowler_name"],
                "hp_balls": int(row["hp_balls"]),
                "hp_econ": round(row["hp_econ"], 2),
                "base_econ": round(row["base_econ"], 2),
                "econ_diff": round(row["econ_diff"], 2),
                "hp_wickets": int(row["hp_wickets"]),
                "resilience_score": float(row["resilience_score"])
            }
            for idx, (_, row) in enumerate(top.iterrows())
        ]

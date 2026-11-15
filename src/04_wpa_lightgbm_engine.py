"""
src/04_wpa_lightgbm_engine.py
Terminal-Exact OOF Counterfactuals, Innings-1 120th-Ball Continuity, Vectorized p_k Merge & 3-Regime Taxonomy
"""
import numpy as np
import pandas as pd
from pathlib import Path
from lightgbm import LGBMClassifier
from sklearn.model_selection import GroupKFold
from sklearn.isotonic import IsotonicRegression
from sklearn.metrics import brier_score_loss, roc_auc_score

PROC_DIR = Path("data/processed")

def build_counterfactual_features(base_df: pd.DataFrame, runs_added: int, wkt_added: int) -> pd.DataFrame:
    cf = pd.DataFrame(index=base_df.index)
    cf["innings"] = base_df["innings"]
    rem_balls_raw = base_df["balls_remaining"] - 1
    rem_wkts_raw = base_df["wickets_in_hand"] - wkt_added

    cf["balls_remaining"] = np.maximum(1, rem_balls_raw)
    cf["score_t_minus_1"] = base_df["score_t_minus_1"] + runs_added
    cf["wickets_in_hand"] = np.maximum(1, rem_wkts_raw)

    balls_bowled_after = np.maximum(1, 120 - np.maximum(0, rem_balls_raw))
    cf["crr_t"] = (cf["score_t_minus_1"] * 6.0) / balls_bowled_after
    cf["runs_req_filled"] = np.where(
        cf["innings"] == 2, np.maximum(0.0, base_df["runs_req_filled"] - runs_added), 0.0
    )
    cf["rrr_filled"] = np.where(
        cf["innings"] == 2, (cf["runs_req_filled"] * 6.0) / cf["balls_remaining"], base_df["venue_phase_par_rr"]
    )
    par_rem_runs = (np.maximum(0, rem_balls_raw) / 6.0) * base_df["venue_phase_par_rr"]
    cf["projected_first_inn_score"] = np.where(
        cf["innings"] == 1,
        np.where(
            (rem_wkts_raw <= 0) | (rem_balls_raw <= 0),
            cf["score_t_minus_1"],
            cf["score_t_minus_1"] + par_rem_runs * (cf["wickets_in_hand"] / 10.0) ** 0.35,
        ),
        0.0,
    )
    cf["venue_phase_par_rr"] = base_df["venue_phase_par_rr"]
    cf["venue_chase_win_prior"] = base_df["venue_chase_win_prior"]
    cf["venue_cat"] = base_df["venue_cat"]
    cf["comp_cat"] = base_df["comp_cat"]
    return cf

def train_wpa_and_pressure_engine() -> None:
    bbb = pd.read_parquet(PROC_DIR / "bbb_calibrated.parquet")
    bbb = bbb.sort_values(["match_id", "innings", "delivery_seq"]).reset_index(drop=True)

    bbb["runs_req_filled"] = bbb["runs_required_t"].fillna(0.0)
    bbb["rrr_filled"] = bbb["rrr_t"].fillna(bbb["venue_phase_par_rr"])
    bbb["par_remaining_runs"] = (bbb["balls_remaining"] / 6.0) * bbb["venue_phase_par_rr"]
    bbb["projected_first_inn_score"] = np.where(
        bbb["innings"] == 1,
        bbb["score_t_minus_1"] + bbb["par_remaining_runs"] * (bbb["wickets_in_hand"] / 10.0) ** 0.35,
        0.0,
    )
    bbb["venue_chase_win_prior"] = bbb.get("venue_chase_win_prior", pd.Series(0.53, index=bbb.index)).fillna(0.53)
    bbb["venue_cat"] = bbb["venue"].astype("category")
    bbb["comp_cat"] = bbb["competition_id"].astype("category")

    feature_cols = [
        "innings",
        "balls_remaining",
        "score_t_minus_1",
        "wickets_in_hand",
        "crr_t",
        "runs_req_filled",
        "rrr_filled",
        "projected_first_inn_score",
        "venue_phase_par_rr",
        "venue_chase_win_prior",
        "venue_cat",
        "comp_cat",
    ]
    monotone_constraints = [0, 0, 1, 1, 1, -1, -1, 1, 0, 0, 0, 0]

    X = bbb[feature_cols]
    y = bbb["is_batting_team_win"].values.astype(int)
    groups = bbb["match_id"].values

    outcomes_spec = [(0, 0), (1, 0), (2, 0), (4, 0), (6, 0), (0, 1)]
    print("[04_wpa_lightgbm_engine] Building counterfactual matrices for all 6 canonical outcomes...")
    cf_matrices = {
        (r, w): build_counterfactual_features(bbb, r, w)[feature_cols]
        for (r, w) in outcomes_spec
    }

    gkf = GroupKFold(n_splits=5)
    oof_wp_prev = np.zeros(len(bbb), dtype=float)
    oof_cf_preds = {(r, w): np.zeros(len(bbb), dtype=float) for (r, w) in outcomes_spec}

    print("[04_wpa_lightgbm_engine] Training GroupKFold(n_splits=5) LightGBM with monotonic constraints...")
    for fold, (train_idx, val_idx) in enumerate(gkf.split(X, y, groups)):
        model = LGBMClassifier(
            n_estimators=350,
            learning_rate=0.04,
            num_leaves=31,
            min_child_samples=60,
            subsample=0.8,
            colsample_bytree=0.8,
            monotone_constraints=monotone_constraints,
            random_state=42 + fold,
            verbose=-1,
            n_jobs=-1,
        )
        model.fit(X.iloc[train_idx], y[train_idx])

        train_raw = model.predict_proba(X.iloc[train_idx])[:, 1]
        iso_fold = IsotonicRegression(out_of_bounds="clip", y_min=0.01, y_max=0.99)
        iso_fold.fit(train_raw, y[train_idx])

        val_raw = model.predict_proba(X.iloc[val_idx])[:, 1]
        oof_wp_prev[val_idx] = iso_fold.transform(val_raw)

        for (r, w), cf_X in cf_matrices.items():
            cf_raw = model.predict_proba(cf_X.iloc[val_idx])[:, 1]
            oof_cf_preds[(r, w)][val_idx] = iso_fold.transform(cf_raw)
        print(f"  Fold {fold + 1}/5 completed.")

    # Enforce exact deterministic terminal states on Innings-2 counterfactuals
    inn2_mask = (bbb["innings"] == 2).values
    rem_balls_1 = (bbb["balls_remaining"] <= 1).values
    rem_wkts_1 = (bbb["wickets_in_hand"] <= 1).values
    req_runs = bbb["runs_req_filled"].values

    for (r, w) in outcomes_spec:
        preds = oof_cf_preds[(r, w)]
        target_won = inn2_mask & ((req_runs - r) <= 0)
        preds[target_won] = 1.0
        still_short = inn2_mask & ((req_runs - r) > 1)
        tied_finish = inn2_mask & ((req_runs - r) == 1)
        all_out_or_balls_up = (rem_wkts_1 & (w == 1)) | rem_balls_1
        preds[still_short & all_out_or_balls_up] = 0.0
        preds[tied_finish & all_out_or_balls_up] = 0.50
        oof_cf_preds[(r, w)] = preds

    bbb["wp_t_minus_1"] = oof_wp_prev
    auc = roc_auc_score(y, oof_wp_prev)
    brier = brier_score_loss(y, oof_wp_prev)
    print(f"[04_wpa_lightgbm_engine] Leak-Free GroupKFold OOF ROC-AUC: {auc:.4f} | Brier Score: {brier:.4f}")

    bbb["wp_t"] = bbb.groupby(["match_id", "innings"])["wp_t_minus_1"].shift(-1)
    is_last_ball_inn = bbb["wp_t"].isna()
    bbb.loc[is_last_ball_inn & (bbb["innings"] == 2), "wp_t"] = bbb.loc[
        is_last_ball_inn & (bbb["innings"] == 2), "is_batting_team_win"
    ].astype(float)

    # Fix #28 (v4 #5): On the terminal ball of Innings 1, use the Innings-1 OOF counterfactual prediction for the actual outcome
    # so the tree-split transition gap between Innings 1 and Innings 2 is never dumped onto the 120th ball!
    inn1_end_idx = bbb.index[is_last_ball_inn & (bbb["innings"] == 1)]
    for idx in inn1_end_idx:
        if bbb.loc[idx, "is_team_wicket"] == 1:
            bbb.loc[idx, "wp_t"] = oof_cf_preds[(0, 1)][idx]
        else:
            r_act = int(bbb.loc[idx, "total_runs"])
            r_bucket = 6 if r_act >= 6 else (4 if r_act >= 4 else (2 if r_act >= 2 else (1 if r_act == 1 else 0)))
            bbb.loc[idx, "wp_t"] = oof_cf_preds[(r_bucket, 0)][idx]

    bbb["wp_t"] = bbb["wp_t"].fillna(bbb["wp_t_minus_1"])

    # Clean 3-Way Attribution of WPA across Striker, Non-Striker (on Run-Outs), and Bowler
    bbb["wpa_ball"] = bbb["wp_t"] - bbb["wp_t_minus_1"]
    is_non_bowler_wkt = (bbb["is_team_wicket"] == 1) & (bbb["is_bowler_wicket"] == 0)
    non_striker_runout = is_non_bowler_wkt & (bbb["is_non_striker_dismissed"] == 1)

    bbb["batter_wpa_ball"] = np.where(non_striker_runout, 0.0, bbb["wpa_ball"])
    bbb["non_striker_wpa_ball"] = np.where(non_striker_runout, bbb["wpa_ball"], 0.0)

    bowler_run_share = np.where(
        bbb["total_runs"] > 0, bbb["bowler_runs"] / np.maximum(1, bbb["total_runs"]), 1.0
    )
    bbb["bowler_wpa_ball"] = np.where(
        is_non_bowler_wkt,
        0.0,
        np.where(bbb["is_bowler_wicket"] == 1, -bbb["wpa_ball"], -bbb["wpa_ball"] * bowler_run_share),
    )

    # Fix #29 (v4 #6): Fast Vectorized Empirical Venue-Phase Outcome Priors p_k(phase, venue) without MultiIndex.map()
    bbb["outcome_bucket"] = np.select(
        [
            bbb["is_team_wicket"] == 1,
            bbb["runs_off_bat"] == 6,
            bbb["runs_off_bat"] == 4,
            bbb["total_runs"] >= 2,
            bbb["total_runs"] == 1,
        ],
        ["0_1", "6_0", "4_0", "2_0", "1_0"],
        default="0_0",
    )
    global_phase_probs = (
        bbb.groupby(["phase", "outcome_bucket"]).size().unstack(fill_value=1).pipe(lambda d: d.div(d.sum(axis=1), axis=0))
    )
    vp_counts = bbb.groupby(["venue", "phase", "outcome_bucket"]).size().unstack(fill_value=0)
    vp_totals = vp_counts.sum(axis=1)

    vp_prob_table = pd.DataFrame(index=vp_counts.index)
    for (r, w) in outcomes_spec:
        key = f"{r}_{w}"
        g_prior = vp_prob_table.index.get_level_values("phase").map(
            lambda ph: global_phase_probs.loc[ph, key] if (ph in global_phase_probs.index and key in global_phase_probs.columns) else 0.1
        ).values
        obs_c = vp_counts[key].values if key in vp_counts.columns else np.zeros(len(vp_prob_table))
        vp_prob_table[f"pk_{key}"] = (obs_c + 60.0 * g_prior) / (vp_totals.values + 60.0)

    vp_prob_df = vp_prob_table.reset_index()
    bbb_pk = bbb[["venue", "phase"]].merge(vp_prob_df, on=["venue", "phase"], how="left")

    var_wp = np.zeros(len(bbb), dtype=float)
    for (r, w) in outcomes_spec:
        key = f"{r}_{w}"
        p_k = bbb_pk[f"pk_{key}"].fillna(0.15).values
        var_wp += p_k * (oof_cf_preds[(r, w)] - bbb["wp_t_minus_1"].values) ** 2

    sigma_wp = np.sqrt(np.maximum(1e-9, var_wp))
    bbb["leverage_index"] = sigma_wp / max(sigma_wp.mean(), 1e-6)

    # Structural Context Pressure Index (CPI_t in [0, 100])
    is_death = (bbb["phase"] == "DEATH").astype(float)
    rate_press = np.where(
        bbb["innings"] == 2,
        (1.0 / (1.0 + np.exp(-(bbb["rrr_filled"] - bbb["venue_phase_par_rr"]) / 2.2)))
        * (bbb["rrr_filled"] <= 24.0).astype(float),
        1.0 / (1.0 + np.exp(-((bbb["venue_phase_par_rr"] - bbb["crr_t"]) / 2.0 + 0.50 * is_death))),
    )
    expected_wkts = np.maximum(0.8, ((120 - bbb["balls_remaining"]) / 120.0) * 6.5)
    wkt_press_bat = np.clip(
        0.45 * (bbb["wickets_t_minus_1"] / expected_wkts)
        + 0.35 * (bbb["wkts_last_12_balls"] >= 1).astype(float)
        + 0.20 * (bbb["wkts_last_18_balls"] >= 2).astype(float),
        0.0,
        1.0,
    )
    wkt_press_bowl = np.clip(
        0.50 * (bbb["wickets_in_hand"] / 10.0)
        + 0.50 * np.minimum(1.0, bbb["partnership_runs_before"] / 40.0),
        0.0,
        1.0,
    )
    time_press = ((120.0 - bbb["balls_remaining"]) / 120.0) ** 0.75
    closeness = 4.0 * bbb["wp_t_minus_1"] * (1.0 - bbb["wp_t_minus_1"])
    li_norm = np.clip(bbb["leverage_index"] / 2.2, 0.0, 1.0)

    bbb["cpi_bat"] = 100.0 * (
        0.35 * li_norm + 0.25 * rate_press + 0.20 * wkt_press_bat + 0.10 * time_press + 0.10 * closeness
    )
    bbb["cpi_bowl"] = 100.0 * (
        0.35 * li_norm + 0.25 * rate_press + 0.20 * wkt_press_bowl + 0.10 * time_press + 0.10 * closeness
    )

    is_alive_match = (bbb["wp_t_minus_1"] >= 0.05) & (bbb["wp_t_minus_1"] <= 0.95)
    bbb["is_high_pressure_bat"] = (is_alive_match & ((bbb["cpi_bat"] >= 60.0) | (bbb["leverage_index"] >= 1.35))).astype(int)
    bbb["is_high_pressure_bowl"] = (is_alive_match & ((bbb["cpi_bowl"] >= 60.0) | (bbb["leverage_index"] >= 1.35))).astype(int)

    # 3-Regime Tactical Pressure Taxonomy Flags for BOTH Batters & Bowlers
    bbb["is_crisis_regime_bat"] = (
        is_alive_match & ((bbb["wkts_last_18_balls"] >= 2) | ((bbb["phase"] == "PP") & (bbb["wickets_t_minus_1"] >= 2)))
    ).astype(int)
    bbb["is_escalation_regime_bat"] = (
        is_alive_match & ((bbb["phase"] == "DEATH") | ((bbb["innings"] == 2) & (bbb["rrr_filled"] >= 10.5)))
    ).astype(int)
    bbb["is_crisis_regime_bowl"] = (
        is_alive_match
        & (
            ((bbb["innings"] == 2) & (bbb["target_runs"].fillna(175) <= 160))
            | ((bbb["innings"] == 2) & (bbb["rrr_filled"] <= bbb["venue_phase_par_rr"]) & (bbb["wickets_in_hand"] >= 6))
        )
    ).astype(int)
    bbb["is_escalation_regime_bowl"] = (
        is_alive_match & (bbb["phase"] == "DEATH") & ((bbb["wickets_in_hand"] >= 4) | (bbb["partnership_runs_before"] >= 25))
    ).astype(int)
    bbb["is_crunch_regime"] = (
        (bbb["wp_t_minus_1"] >= 0.20) & (bbb["wp_t_minus_1"] <= 0.80) & (bbb["leverage_index"] >= 1.60)
    ).astype(int)

    bbb.drop(columns=["outcome_bucket"], inplace=True)
    out_path = PROC_DIR / "bbb_with_wpa_pressure.parquet"
    bbb.to_parquet(out_path, index=False)
    print(f"[04_wpa_lightgbm_engine] Saved leak-free WPA, continuity-exact LI_t, CPI_t & 3-regime pressure taxonomy to {out_path}.")

if __name__ == "__main__":
    train_wpa_and_pressure_engine()

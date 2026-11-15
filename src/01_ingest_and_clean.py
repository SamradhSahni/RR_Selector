"""
src/01_ingest_and_clean.py
Deconfounded Ball-by-Ball Ingestion & State Engineering (v5 Championship Edition)
Includes:
- 'retired hurt' exclusion from is_team_wicket (Fix #24)
- Intra-over prev_ball_is_boundary partitioning (Fix #25)
- Leave-One-Match-Out (LOMO) Empirical Bayes Venue Par (Fix #19)
- Leave-One-Match-Out (LOMO) Venue Chasing Win-Rate Prior (Enhancement #35)
- Stump-Attacking Wicket Flag (Enhancement #36)
- Completed-Match Playing XI Guard (Fix #23)
"""
import duckdb
from pathlib import Path

def resolve_raw_dir() -> Path:
    candidates = [
        Path("Data Pack"),
        Path("data/raw/Data Pack"),
        Path("data/raw"),
        Path("extracted_data/Data Pack"),
    ]
    for path in candidates:
        if (path / "ball_by_ball.csv").exists():
            return path
    raise FileNotFoundError("Could not locate ball_by_ball.csv in candidate raw directories.")

RAW_DIR = resolve_raw_dir()
PROC_DIR = Path("data/processed")
PROC_DIR.mkdir(parents=True, exist_ok=True)

def build_enriched_bbb() -> None:
    con = duckdb.connect()

    tables = {
        "competitions": "competitions.csv",
        "teams": "teams.csv",
        "matches": "matches.csv",
        "mapping": "competition_team_player_mapping.csv",
        "xi": "playing_eleven.csv",
        "bbb": "ball_by_ball.csv",
    }
    for name, fname in tables.items():
        csv_path = (RAW_DIR / fname).as_posix()
        con.execute(f"CREATE TABLE {name} AS SELECT * FROM read_csv_auto('{csv_path}', ignore_errors=true)")

    # Fix #23: Only count Playing XI appearances in completed matches (where win_team_id is present)
    xi_query = """
    SELECT 
        CAST(x.player_id AS VARCHAR) AS player_id,
        COUNT(DISTINCT x.match_id) AS xi_matches
    FROM xi x
    JOIN matches m ON x.match_id = m.match_id
    WHERE m.win_team_id IS NOT NULL AND CAST(m.win_team_id AS VARCHAR) != ''
    GROUP BY CAST(x.player_id AS VARCHAR)
    """
    con.execute(f"COPY ({xi_query}) TO '{(PROC_DIR / 'player_xi_counts.parquet').as_posix()}' (FORMAT PARQUET)")

    query = """
    WITH base_bbb AS (
        SELECT 
            b.*,
            CAST(m.comp_id AS VARCHAR) AS competition_id,
            LOWER(COALESCE(CAST(c.comp_name AS VARCHAR), '')) AS competition_name_lower,
            COALESCE(CAST(m.venue_id AS VARCHAR), 'Unknown_Venue') AS venue,
            TRY_CAST(m.match_date AS DATE) AS match_date_parsed,
            CAST(m.win_team_id AS VARCHAR) AS winner_id,
            CAST(m.toss_win_team_id AS VARCHAR) AS toss_winner,
            LOWER(COALESCE(CAST(m.toss_opted AS VARCHAR), '')) AS toss_decision,
            (b.overid - MIN(b.overid) OVER (PARTITION BY b.match_id, b.innings)) AS over_idx,
            CASE 
                WHEN (b.overid - MIN(b.overid) OVER (PARTITION BY b.match_id, b.innings)) < 6 THEN 'PP'
                WHEN (b.overid - MIN(b.overid) OVER (PARTITION BY b.match_id, b.innings)) < 15 THEN 'MID'
                ELSE 'DEATH'
            END AS phase,
            CASE WHEN LOWER(COALESCE(b.extras_type, '')) NOT IN ('wide', 'overstep') THEN 1 ELSE 0 END AS is_legal_ball,
            CASE WHEN LOWER(COALESCE(b.extras_type, '')) != 'wide' THEN 1 ELSE 0 END AS is_batter_ball,
            CASE WHEN LOWER(COALESCE(b.extras_type, '')) IN ('wide', 'overstep') THEN 1 ELSE 0 END AS is_bowler_extra,
            COALESCE(b.runs, 0) + COALESCE(b.extras1_runs, 0) + COALESCE(b.extras_2_runs, 0) AS total_runs,
            COALESCE(b.runs, 0) + CASE WHEN LOWER(COALESCE(b.extras_type, '')) IN ('wide', 'overstep') THEN COALESCE(b.extras1_runs, 0) + COALESCE(b.extras_2_runs, 0) ELSE 0 END AS bowler_runs,
            COALESCE(b.runs, 0) AS runs_off_bat,
            CASE WHEN b.is_four = true OR b.runs = 4 THEN 1 ELSE 0 END AS is_four,
            CASE WHEN b.is_six = true OR b.runs = 6 THEN 1 ELSE 0 END AS is_six,
            CASE WHEN (b.is_four = true OR b.is_six = true OR b.runs IN (4, 6)) THEN 1 ELSE 0 END AS is_boundary,
            CASE WHEN b.runs IN (1, 2, 3) THEN 1 ELSE 0 END AS is_strike_rotation,
            CASE WHEN b.runs = 0 AND LOWER(COALESCE(b.extras_type, '')) NOT IN ('wide', 'overstep') THEN 1 ELSE 0 END AS is_dot_bowl,
            CASE WHEN b.runs = 0 AND LOWER(COALESCE(b.extras_type, '')) != 'wide' THEN 1 ELSE 0 END AS is_dot_bat,
            CASE 
                WHEN b.is_wicket = true 
                     AND LOWER(COALESCE(CAST(b.dismissal_type AS VARCHAR), '')) NOT IN ('retired hurt', 'retire out')
                THEN 1 ELSE 0 
            END AS is_team_wicket,
            CASE 
                WHEN b.is_wicket = true 
                     AND CAST(b.dismissed_player_id AS BIGINT) = CAST(b.striker_id AS BIGINT)
                     AND LOWER(COALESCE(CAST(b.dismissal_type AS VARCHAR), '')) NOT IN ('retired hurt', 'retire out')
                THEN 1 ELSE 0 
            END AS is_striker_dismissed,
            CASE 
                WHEN b.is_wicket = true 
                     AND CAST(b.dismissed_player_id AS BIGINT) = CAST(b.non_striker_id AS BIGINT)
                     AND LOWER(COALESCE(CAST(b.dismissal_type AS VARCHAR), '')) NOT IN ('retired hurt', 'retire out')
                THEN 1 ELSE 0 
            END AS is_non_striker_dismissed,
            CASE WHEN b.is_wicket = true AND LOWER(COALESCE(CAST(b.dismissal_type AS VARCHAR), '')) IN (
                'bowled', 'caught', 'caught and bowled', 'lbw', 'stump', 'stumped', 'hit wicket'
            ) THEN 1 ELSE 0 END AS is_bowler_wicket,
            CASE WHEN b.is_wicket = true AND LOWER(COALESCE(CAST(b.dismissal_type AS VARCHAR), '')) IN ('bowled', 'lbw') THEN 1 ELSE 0 END AS is_stump_attack_wkt,
            ROW_NUMBER() OVER (
                PARTITION BY b.match_id, b.innings 
                ORDER BY b.overid, b.over_ball_num, b.innings_ball_num
            ) AS delivery_seq
        FROM bbb b
        JOIN matches m ON b.match_id = m.match_id
        LEFT JOIN competitions c ON CAST(m.comp_id AS VARCHAR) = CAST(c.comp_id AS VARCHAR)
        WHERE b.innings IN (1, 2)
          AND m.win_team_id IS NOT NULL AND CAST(m.win_team_id AS VARCHAR) != ''
    ),
    max_date_cte AS (
        SELECT MAX(match_date_parsed) AS max_dataset_date FROM base_bbb
    ),
    batter_first_seen AS (
        SELECT 
            match_id,
            innings,
            player_id,
            MIN(delivery_seq) AS first_ball_seq
        FROM (
            SELECT match_id, innings, CAST(striker_id AS VARCHAR) AS player_id, delivery_seq FROM base_bbb
            UNION ALL
            SELECT match_id, innings, CAST(non_striker_id AS VARCHAR) AS player_id, delivery_seq FROM base_bbb
        )
        GROUP BY match_id, innings, player_id
    ),
    batting_order_map AS (
        SELECT
            match_id,
            innings,
            player_id,
            ROW_NUMBER() OVER (PARTITION BY match_id, innings ORDER BY first_ball_seq, player_id) AS batting_pos
        FROM batter_first_seen
    ),
    state_bbb AS (
        SELECT
            b.*,
            CASE WHEN b.competition_name_lower LIKE '%ipl%' OR b.competition_name_lower LIKE '%indian premier%' THEN 1 ELSE 0 END AS is_ipl_match,
            GREATEST(0.45, POW(0.5, COALESCE(DATEDIFF('day', b.match_date_parsed, md.max_dataset_date), 365) / 730.0)) AS recency_weight,
            COALESCE(bo_str.batting_pos, 6) AS striker_batting_pos,
            COALESCE(bo_dis.batting_pos, COALESCE(bo_str.batting_pos, 6)) AS dismissed_batting_pos,
            COALESCE(SUM(b.total_runs) OVER w_prev, 0) AS score_t_minus_1,
            COALESCE(SUM(b.is_team_wicket) OVER w_prev, 0) AS wickets_t_minus_1,
            COALESCE(SUM(b.is_legal_ball) OVER w_prev, 0) AS legal_balls_before,
            GREATEST(1, 120 - COALESCE(SUM(b.is_legal_ball) OVER w_prev, 0)) AS balls_remaining,
            SUM(b.total_runs) OVER (PARTITION BY b.match_id, b.innings) AS innings_final_total,
            COALESCE(SUM(b.is_team_wicket) OVER (
                PARTITION BY b.match_id, b.innings 
                ORDER BY b.delivery_seq 
                ROWS BETWEEN 12 PRECEDING AND 1 PRECEDING
            ), 0) AS wkts_last_12_balls,
            COALESCE(SUM(b.is_team_wicket) OVER (
                PARTITION BY b.match_id, b.innings 
                ORDER BY b.delivery_seq 
                ROWS BETWEEN 18 PRECEDING AND 1 PRECEDING
            ), 0) AS wkts_last_18_balls,
            COALESCE(SUM(b.is_batter_ball) OVER (
                PARTITION BY b.match_id, b.innings, b.striker_id
                ORDER BY b.delivery_seq
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ), 1) AS batter_ball_num_in_innings,
            COALESCE(LAG(b.is_boundary, 1) OVER (
                PARTITION BY b.match_id, b.innings, b.over_idx, b.bowler_id
                ORDER BY b.delivery_seq
            ), 0) AS prev_ball_is_boundary
        FROM base_bbb b
        CROSS JOIN max_date_cte md
        LEFT JOIN batting_order_map bo_str 
            ON b.match_id = bo_str.match_id AND b.innings = bo_str.innings AND CAST(b.striker_id AS VARCHAR) = bo_str.player_id
        LEFT JOIN batting_order_map bo_dis 
            ON b.match_id = bo_dis.match_id AND b.innings = bo_dis.innings AND CAST(b.dismissed_player_id AS VARCHAR) = bo_dis.player_id
        WINDOW w_prev AS (
            PARTITION BY b.match_id, b.innings 
            ORDER BY b.delivery_seq 
            ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
        )
    ),
    partnership_bbb AS (
        SELECT
            s.*,
            COALESCE(SUM(s.total_runs) OVER (
                PARTITION BY s.match_id, s.innings, s.wickets_t_minus_1
                ORDER BY s.delivery_seq
                ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
            ), 0) AS partnership_runs_before
        FROM state_bbb s
    ),
    global_phase_par AS (
        SELECT
            phase,
            SUM(total_runs) * 6.0 / GREATEST(1, SUM(is_legal_ball)) AS g_par_rr,
            SUM(runs_off_bat) * 1.0 / GREATEST(1, SUM(is_batter_ball)) AS g_par_bat_rpb,
            SUM(bowler_runs) * 1.0 / GREATEST(1, SUM(is_legal_ball)) AS g_par_bowl_rpb
        FROM partnership_bbb
        GROUP BY phase
    ),
    venue_totals AS (
        SELECT
            venue,
            phase,
            SUM(total_runs) AS v_total_runs,
            SUM(runs_off_bat) AS v_bat_runs,
            SUM(bowler_runs) AS v_bowl_runs,
            SUM(is_legal_ball) AS v_legal_balls,
            SUM(is_batter_ball) AS v_batter_balls
        FROM partnership_bbb
        GROUP BY venue, phase
    ),
    match_phase_totals AS (
        SELECT
            match_id,
            venue,
            phase,
            SUM(total_runs) AS m_total_runs,
            SUM(runs_off_bat) AS m_bat_runs,
            SUM(bowler_runs) AS m_bowl_runs,
            SUM(is_legal_ball) AS m_legal_balls,
            SUM(is_batter_ball) AS m_batter_balls
        FROM partnership_bbb
        GROUP BY match_id, venue, phase
    ),
    lomo_venue_par AS (
        SELECT
            mp.match_id,
            mp.venue,
            mp.phase,
            ((vt.v_total_runs - mp.m_total_runs) * 6.0 + 240.0 * g.g_par_rr) / (GREATEST(0, vt.v_legal_balls - mp.m_legal_balls) + 240.0) AS venue_phase_par_rr,
            ((vt.v_bat_runs - mp.m_bat_runs) * 1.0 + 240.0 * g.g_par_bat_rpb) / (GREATEST(0, vt.v_batter_balls - mp.m_batter_balls) + 240.0) AS venue_phase_par_bat_rpb,
            ((vt.v_bowl_runs - mp.m_bowl_runs) * 1.0 + 240.0 * g.g_par_bowl_rpb) / (GREATEST(0, vt.v_legal_balls - mp.m_legal_balls) + 240.0) AS venue_phase_par_bowl_rpb
        FROM match_phase_totals mp
        JOIN venue_totals vt ON mp.venue = vt.venue AND mp.phase = vt.phase
        JOIN global_phase_par g ON mp.phase = g.phase
    ),
    match_chase_outcomes AS (
        SELECT
            match_id,
            MAX(venue) AS venue,
            MAX(CASE WHEN innings = 2 AND CAST(batting_team_id AS VARCHAR) = winner_id THEN 1 ELSE 0 END) AS is_chase_win
        FROM partnership_bbb
        GROUP BY match_id
    ),
    venue_chase_totals AS (
        SELECT venue, COUNT(*) AS v_matches, SUM(is_chase_win) AS v_chase_wins
        FROM match_chase_outcomes
        GROUP BY venue
    ),
    lomo_chase_prior AS (
        SELECT
            mc.match_id,
            ((vc.v_chase_wins - mc.is_chase_win) + 15.0 * 0.53) / (GREATEST(0, vc.v_matches - 1) + 15.0) AS venue_chase_win_prior
        FROM match_chase_outcomes mc
        JOIN venue_chase_totals vc ON mc.venue = vc.venue
    )
    SELECT
        p.*,
        10 - LEAST(9, p.wickets_t_minus_1) AS wickets_in_hand,
        CASE 
            WHEN p.legal_balls_before > 0 
            THEN (p.score_t_minus_1 * 6.0) / p.legal_balls_before 
            ELSE 0.0 
        END AS crr_t,
        first_inn.target_runs,
        CASE 
            WHEN p.innings = 2 THEN GREATEST(0, first_inn.target_runs - p.score_t_minus_1)
            ELSE NULL 
        END AS runs_required_t,
        CASE 
            WHEN p.innings = 2 THEN (GREATEST(0, first_inn.target_runs - p.score_t_minus_1) * 6.0) / p.balls_remaining
            ELSE NULL 
        END AS rrr_t,
        COALESCE(vp.venue_phase_par_rr, 8.2) AS venue_phase_par_rr,
        COALESCE(vp.venue_phase_par_bat_rpb, 1.30) AS venue_phase_par_bat_rpb,
        COALESCE(vp.venue_phase_par_bowl_rpb, 1.36) AS venue_phase_par_bowl_rpb,
        COALESCE(lcp.venue_chase_win_prior, 0.53) AS venue_chase_win_prior,
        CASE WHEN CAST(p.batting_team_id AS VARCHAR) = p.winner_id THEN 1 ELSE 0 END AS is_batting_team_win
    FROM partnership_bbb p
    LEFT JOIN (
        SELECT match_id, MAX(innings_final_total) + 1 AS target_runs
        FROM partnership_bbb
        WHERE innings = 1
        GROUP BY match_id
    ) first_inn ON p.match_id = first_inn.match_id
    LEFT JOIN lomo_venue_par vp ON p.match_id = vp.match_id AND p.venue = vp.venue AND p.phase = vp.phase
    LEFT JOIN lomo_chase_prior lcp ON p.match_id = lcp.match_id
    """
    out_file = (PROC_DIR / "bbb_enriched.parquet").as_posix()
    con.execute(f"COPY ({query}) TO '{out_file}' (FORMAT PARQUET)")
    print(f"[01_ingest_and_clean] Saved LOMO-deconfounded ball-by-ball dataset to {out_file}")

if __name__ == "__main__":
    build_enriched_bbb()

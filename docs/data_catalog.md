# Data Catalog: SupeRR Selector Season 2

This catalog provides technical documentation for all datasets located in `Data Pack/`.

---

## 1. `ball_by_ball.csv`
- **Total Records:** 200,999
- **Unique Matches:** 867
- **Primary / Grain:** One row per delivery (legal delivery or extra).
- **Key Columns:**
  - `match_id` (int): Foreign key to `matches.csv`.
  - `innings` (int): 1, 2, 3 (Super Over 1), 4 (Super Over 2).
  - `overid` (int): Over number (1 to 20).
  - `over_ball_num` (int): Ball number within the over (1 to 6+ for extras).
  - `innings_ball_num` (int): Sequential delivery counter within the innings.
  - `batting_team_id` (int), `bowling_team_id` (int): Foreign keys to `teams.csv`.
  - `striker_id` (int), `striker_name` (str): Batter facing.
  - `non_striker_id` (int), `non_striker_name` (str): Partner at non-striker's end.
  - `bowler_id` (int), `bowler_name` (str): Bowler delivering.
  - `batting_type` (str), `bowling_type` (str): Skill classification (e.g. RHB, LHB, Right-arm Fast, Left-arm Orthodox).
  - `batting_order` (int): Position in batting order (1 to 11).
  - `runs` (int): Runs scored off the bat (0, 1, 2, 3, 4, 5, 6).
  - `is_four` (bool), `is_six` (bool): Boundary indicators.
  - `is_wicket` (bool): True if any dismissal occurred on this ball.
  - `dismissal_type` (str): Caught (7,557), Bowled (1,775), LBW (709), RunOut (600), Stump (214), Hit Wicket (17), Retire Out (6), Obstructing the field (3). Note: Bowler credit applies to Caught, Bowled, LBW, Stump, Hit Wicket.
  - `dismissed_player_id` (float): ID of player who was out.
  - `extras_type` (str): wide (7,714), legbyes (2,748), Overstep / no-ball (576), byes (529), other (264), Penalty (1).
  - `extras1_runs` (int), `extras_2_runs` (int): Extra runs conceded.
  - `pace_or_spin` (str): Pace vs Spin classification.
  - `bowl_speed` (float): Speed in km/h.
  - `stroke` (str): Shot classification (e.g., Pull, Drive, Flick, Cut, Slog).
  - `delivery_style` (str): In-swinger, Out-swinger, Googly, Yorker, Bouncer, etc.
  - `over_or_around` (str): Over the wicket vs Around the wicket.
  - `on_or_off` (str): Line of delivery (Off-side, On-side).
  - `delivery_ist_time` (str): Timestamp in UTC / IST.

---

## 2. `matches.csv`
- **Total Records:** 883
- **Date Range:** 2022-01-22 to 2026-11-01
- **Key Columns:**
  - `match_id` (int): Primary key.
  - `comp_id` (int): Foreign key to `competitions.csv`.
  - `match_number` (int): Sequential tournament match number.
  - `match_date` (str): Date of match (YYYY-MM-DD).
  - `stage` (str): League (620), Others (226), Final (12), Qualifier (10), Super 4 (6), Eliminator (5), Semi Final (4).
  - `venue_id` (int), `venue_country` (str): 98 unique venues across 17 countries.
  - `home_team_id` (int), `away_team_id` (int), `home_team` (str), `away_team` (str).
  - `home_team_captain_id` (float), `away_team_captain_id` (float).
  - `toss_win_team_id` (float), `toss_opted` (str: Fielding / Batting).
  - `man_of_the_match` (str): Player name awarded POTM.
  - `first_inn_revised_overs` (float), `second_inn_revised_overs` (float), `revised_target` (float): Rain-affected adjustments (DLS).
  - `knock_out` (int): 1 = Knockout/Playoff/Elimination match (31 matches), 0 = Regular league match (852 matches).
  - `win_team_id` (float): Winner team ID.
  - `result` (str): Result text (e.g., "West Indies Won by 9 Wickets", "England Won by 1 Run").

---

## 3. `competitions.csv`
- **Total Records:** 141
- **Key Columns:**
  - `comp_id` (int): Primary key.
  - `comp_name` (str): Competition title.
  - `match_format` (str): T20I (134 competitions) or T20 (7 competitions).
  - `season` (str): Seasons 2022 through 2026.
- **Key Competitions:**
  - `IPL 2022` (comp_id 1358)
  - `IPL 2023` (comp_id 1715)
  - `IPL 2024` (comp_id 2193)
  - `IPL 2025` (comp_id 2725)
  - `IPL 2026` (comp_id 3298)
  - Major T20 World Cups and international series.

---

## 4. `playing_eleven.csv`
- **Total Records:** 28,381
- **Key Columns:**
  - `match_id` (int): Foreign key to `matches.csv`.
  - `team_id` (int): Foreign key to `teams.csv`.
  - `player_id` (int): Foreign key to `competition_team_player_mapping.csv`.
  - `batting_order` (float): Listed batting slot.
  - `is_played` (int): 1 if player actively participated on the field.
  - `is_captain` (float): 1 if team captain.
  - `is_wk` (float): 1 if designated wicketkeeper.
  - `is_impact` (int): 1 if brought on as an Impact Player (IPL rules, 558 instances).
  - `is_impact_off` (int): 1 if subbed out as an Impact Player.

---

## 5. `competition_team_player_mapping.csv`
- **Total Records:** 6,413
- **Unique Players:** 1,217
- **Key Columns:**
  - `comp_id` (int): Foreign key to `competitions.csv`.
  - `comp_name` (str): Competition name.
  - `team_id` (int): Team ID.
  - `team_name` (str): Team name.
  - `player_id` (int): Unique canonical player ID.
  - `player_name` (str): Canonical player name (e.g., Virat Kohli, Jasprit Bumrah, Heinrich Klaasen).

---

## 6. `teams.csv`
- **Total Records:** 353
- **Unique Teams:** 38
- **Key Columns:**
  - `comp_id` (int): Tournament ID.
  - `team_id` (int): Team identifier.
  - `team_name` (str): Team title.

---

## 7. Entity Relationships Diagram

```
[competitions] (comp_id)
      │
      ├───< [matches] (match_id, comp_id)
      │         │
      │         ├───< [ball_by_ball] (match_id, striker_id, bowler_id)
      │         │
      │         └───< [playing_eleven] (match_id, player_id)
      │
      ├───< [teams] (comp_id, team_id)
      │
      └───< [competition_team_player_mapping] (comp_id, team_id, player_id)
```

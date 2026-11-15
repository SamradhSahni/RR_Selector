# SupeRR Selector Season 2: Round 1 Problem Statement Specification

## 1. Challenge Overview
- **Competition:** SupeRR Selector Season 2 (Round 1)
- **Objective:** Build a rigorous, data-driven system that measures how batters and bowlers perform in high-pressure match situations compared with their usual (baseline) performance levels.
- **Output:** Identify and rank the players who deliver most consistently when it matters most:
  - Top 10 Batters Under Pressure (Ordered 1 to 10)
  - Top 10 Bowlers Under Pressure (Ordered 1 to 10)
  - In-depth Methodology Report detailing pressure definitions, performance baselines, sample sizes, and empirical validation.

---

## 2. Dataset Architecture & Inventory
The dataset encompasses historical IPL and T20 International (T20I) matches from January 2022 through November 2026:
1. **`ball_by_ball.csv` (200,999 deliveries, 867 unique matches):**
   - Granular delivery records with pitch/release metrics (`pace_or_spin`, `bowl_speed`, `delivery_style`, `stroke`), outcomes (`runs`, `is_four`, `is_six`, `is_wicket`), and dismissals.
2. **`matches.csv` (883 matches, 141 competitions):**
   - Match metadata including `comp_id`, dates, venues, toss outcomes, knockout status, revised overs/targets, and winner.
3. **`competitions.csv` (141 competitions):**
   - 7 domestic T20 competitions (IPL 2022, 2023, 2024, 2025, 2026 + 2 Emerging Asia Cups) and 134 T20I competitions.
4. **`playing_eleven.csv` (28,381 player-match records):**
   - Lineup confirmations, batting orders, captaincy, wicketkeepers, and impact player substitutions.
5. **`competition_team_player_mapping.csv` (6,413 records, 1,217 players):**
   - Canonical player ID to name mappings per team and tournament.
6. **`teams.csv` (353 team-competition pairs, 38 unique teams):**
   - Franchise and national team metadata.

---

## 3. High-Pressure Framework & Formulation

### 3.1 What Constitutes "Pressure" in T20 Cricket?
Pressure in T20 cricket is multi-dimensional and stems from:
1. **Chase / Required Run Rate (RRR) Pressure (Innings 2):**
   - As balls decrease and target remains high, every dot ball exponentially hurts win probability.
   - Thresholds:
     - High Pressure: $RRR \ge 10.0$ with $\le 36$ balls remaining.
     - Extreme Pressure: Last 3 overs (overs 18-20) with target within reach ($\le 45$ runs needed).
2. **Collapse / Wicket Preservation Pressure (Innings 1 & 2):**
   - Loss of top order in Powerplay ($\ge 3$ wickets lost within first 6 overs).
   - High leverage on remaining recognized batters to rebuild without allowing run rate to stagnate.
3. **Death Phase / Endgame Pressure (Overs 16-20):**
   - Peak scoring urgency for batting and maximum penalty for boundary leakage for bowling.
4. **High-Stakes Context Multiplier:**
   - Playoff / Knockout Matches (`knock_out == 1`).
   - High tournament prestige (IPL playoffs and ICC T20 World Cups).

### 3.2 Dynamic Ball Leverage Index (BLI)
A delivery-level composite Leverage Index $L_i \in [0, 1]$ computed using:
$$L_i = w_1 \cdot \text{PhasePressure} + w_2 \cdot \text{RRRPressure} + w_3 \cdot \text{WicketsDownPressure} + w_4 \cdot \text{KnockoutWeight}$$
- Balls with $L_i \ge \text{Threshold}$ are categorized as **High Pressure**, while all other balls form the **Baseline Reference**.

---

## 4. Evaluation Metrics & Ranking Logic

### 4.1 Batting Under Pressure
- **Pressure Strike Rate ($SR_P$):** Runs scored per 100 balls in high-pressure situations.
- **Pressure Boundary Rate ($B\%_P$):** Percentage of deliveries converted to 4s or 6s under pressure.
- **Pressure Dot Ball Suppression ($Dot\%_P$):** Minimizing dot balls when every run counts.
- **Clutch Differential ($\Delta_{SR} = SR_P - SR_{Base}$):** Positive differential signifies players who elevate their scoring rate under pressure.
- **Resilience Score ($S_{Bat}$):** Bayesian-shrunk composite index combining $SR_P$, $\Delta_{SR}$, dismissal resistance, and boundary frequency.

### 4.2 Bowling Under Pressure
- **Pressure Economy Rate ($Econ_P$):** Runs conceded per 6 legal balls in high-pressure situations.
- **Pressure Dot Ball Rate ($Dot\%_{bowl, P}$):** Percentage of dot balls delivered under pressure.
- **Pressure Wicket Strike Rate ($WktRate_P$):** Deliveries per wicket taken in clutch overs.
- **Clutch Economy Differential ($\Delta_{Econ} = Econ_{Base} - Econ_P$):** Positive differential indicates bowlers who restrict runs more effectively under pressure than normal.
- **Resilience Score ($S_{Bowl}$):** Composite index prioritizing run containment and clutch wickets in death/defending phases.

---

## 5. Fair Comparisons & Sample Size Eligibility
- Minimum sample size threshold: $\ge 100$ balls faced/bowled in high-pressure situations across the 2022-2026 dataset.
- Empirical Bayesian shrinkage applied to avoid small-sample volatility.
- Separate normalization for IPL vs T20I conditions where pitch and bowling depth differ.

---

## 6. Required Deliverables
1. **Unstop Dropdown Submission:**
   - 10 Best Batters (Rank 1 to 10)
   - 10 Best Bowlers (Rank 1 to 10)
   - Exact player IDs and names verified against canonical datasets.
2. **Methodology Report:**
   - Comprehensive documentation including executive summary, mathematical formulation, exploratory data analysis, empirical evidence, and limitations.

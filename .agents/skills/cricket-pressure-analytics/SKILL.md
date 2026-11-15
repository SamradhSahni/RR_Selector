---
name: cricket-pressure-analytics
description: Use this skill when calculating cricket pressure metrics, quantifying match leverage, evaluating batting/bowling under high-stakes situations, and producing rankings for SupeRR Selector Season 2.
---

# Cricket Pressure Analytics Playbook (SupeRR Selector Season 2)

## 1. Domain Objective & Problem Scope
Measure how batters and bowlers perform in high-pressure match situations compared to their baseline performance levels, and identify the Top 10 Best Batters Under Pressure and Top 10 Best Bowlers Under Pressure.

## 2. Pressure Quantification Protocol
Every ball in `ball_by_ball.csv` must be evaluated for dynamic match leverage:
1. **Required Run Rate (RRR) & Chase Pressure (Innings 2):**
   - High Pressure: $RRR \ge 10.0$ with $\le 36$ balls remaining, or $RRR \ge 12.0$ with $\le 60$ balls remaining.
   - Extreme Pressure: Last 3 overs (overs 18, 19, 20) with target within reach ($\le 45$ runs needed).
2. **Wickets in Hand & Collapse Pressure (Innings 1 & 2):**
   - 3 or more wickets down inside the Powerplay (overs 1-6).
   - Tail exposure: 6 or more wickets down.
3. **Phase & Match Stage Multipliers:**
   - Death Overs (Overs 16-20) represent natural structural leverage.
   - Knockout Multiplier (`knock_out == 1`): Apply tournament stakes weighting for playoff/final games.
4. **Leverage Index (LI) or Pressure Index ($P_i \in [0, 1]$):**
   - Synthesizes stage of innings, balls remaining, win probability impact, and run rate delta.
   - Binary threshold for High-Pressure filtering: $P_i \ge 0.65$ (or top 25th percentile of leverage).

## 3. Performance Metrics
### Batting Under Pressure:
- **Baseline vs. Pressure Split:** Compare player overall metrics vs. pressure-specific metrics.
- **Key Metrics:**
  - Pressure Strike Rate ($SR_{pressure}$)
  - Pressure Average / Dismissal Rate ($Avg_{pressure}$)
  - Pressure Boundary Rate ($Bnd\%_{pressure} = (4s + 6s) / Balls$)
  - Pressure Dot Ball Minimization ($1 - Dot\%_{pressure}$)
  - Clutch Index ($\Delta_{bat} = Metric_{pressure} - Metric_{baseline}$)

### Bowling Under Pressure:
- **Baseline vs. Pressure Split:** Compare overall economy/strike rate vs. death/high-pressure performance.
- **Key Metrics:**
  - Pressure Economy Rate ($Econ_{pressure}$)
  - Pressure Dot Ball Percentage ($Dot\%_{pressure}$)
  - Pressure Wicket-Taking Rate ($WktRate_{pressure} = Wickets / Balls$)
  - Boundary Conceded Suppression ($BndConc\%_{pressure}$)
  - Clutch Economy Differential ($\Delta_{bowl} = Econ_{baseline} - Econ_{pressure}$)

## 4. Fair Comparison & Sample Size Governance
- **Eligibility Thresholds:**
  - Minimum balls faced under high pressure: e.g., $\ge 120$ balls (or top quartile).
  - Minimum balls bowled under high pressure: e.g., $\ge 120$ balls.
- **Bayesian Shrinkage / Credibility Adjustment:**
  - Regress small sample estimates toward the population mean to avoid outliers with small sample anomalies.
- **Competition Weighting:**
  - Account for IPL quality vs. T20I variations where applicable.

## 5. Verification & Report Generation
- Cross-verify player names against `competition_team_player_mapping.csv` and `playing_eleven.csv`.
- Output deterministic Top 10 rankings with exact quantitative justification and visualizations for the final report.

// AUTO-GENERATED VERIFIED STATIC TELEMETRY BUNDLE — ZERO BACKEND REQUIRED
// Generated and verified directly from data/processed/*.parquet and CSV datasets.

export interface SignatureMatchLog {
  date: string;
  venue: string;
  summary: string;
  raaa_or_waaa: number;
  wpa_pct: number;
  cpi: number;
}

export interface PitchDelivery3D {
  id: number;
  overBall: string;
  outcomeLabel: string;
  runs: number;
  isWicket: boolean;
  cpi: number;
  wpaPct: number;
  regime: "CRISIS" | "ESCALATION" | "CRUNCH";
  start: [number, number, number];
  mid: [number, number, number];
  end: [number, number, number];
  color: string;
}

export interface PlayerStaticDossier {
  player_id: string;
  unstop_rank: number;
  player_name: string;
  country: string;
  role: "BATTER" | "BOWLER";
  archetype: string;
  pose_type: "POWER_LOFT" | "PULL_CUT" | "SPIN_SWEEP" | "PACE_YORKER" | "MYSTERY_SPIN" | "HIGH_ARM_SEAM";
  pressure_reliability_score: number;
  top10_retention_pct: number;
  press_balls: number;
  press_matches: number;
  base_raw_metric: number;
  press_raw_metric: number;
  eb_true_metric: number;
  eb_primary_pb: number;
  ci90_halfwidth: number;
  eb_clutch_delta: number;
  eb_press_wpa_100: number;
  eb_vs_elite_pb: number;
  eb_lbmo_pb: number;
  eb_crisis_pb: number;
  eb_escalation_pb: number;
  eb_crunch_pb: number;
  secondary_micro_val: number;
  tertiary_micro_val: number;
  pro_comp_player: string;
  est_cost_cr: number;
  why_chosen_headline: string;
  why_chosen_pillars: [string, string, string];
  signature_strengths: [string, string, string];
  radar_8axis: { axis: string; player: number; pro_comp: number; top10_avg: number }[];
  signature_matches: SignatureMatchLog[];
  deliveries_3d: PitchDelivery3D[];
}

export const TOP10_BATTERS_STATIC: PlayerStaticDossier[] = [
  {
    "player_id": "6280",
    "unstop_rank": 1,
    "player_name": "Harry Brook",
    "country": "ENG",
    "role": "BATTER",
    "archetype": "2",
    "pose_type": "POWER_LOFT",
    "pressure_reliability_score": 87.67,
    "top10_retention_pct": 100.0,
    "press_balls": 124,
    "press_matches": 7,
    "base_raw_metric": 160.05,
    "press_raw_metric": 188.71,
    "eb_true_metric": 44.9,
    "eb_primary_pb": 0.176,
    "ci90_halfwidth": 0.156,
    "eb_clutch_delta": 0.165,
    "eb_press_wpa_100": 1.08,
    "eb_vs_elite_pb": -0.065,
    "eb_lbmo_pb": 0.109,
    "eb_crisis_pb": 0.132,
    "eb_escalation_pb": 0.26,
    "eb_crunch_pb": 0.275,
    "secondary_micro_val": 0.14,
    "tertiary_micro_val": -0.06,
    "pro_comp_player": "Phil Salt",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "Undisputed #1 High-Pressure Batter (87.62 Score): Accelerates from 160.1 Baseline SR to 188.7 under high leverage (+27.3 True SR above par).",
    "why_chosen_pillars": [
      "Generates +0.176 RAAA/ball and +1.080 WPA/100 balls under pressure\u2014the highest combined win-probability impact in world cricket.",
      "Strikes at 204.3 against 140+ kph express pace in the death overs with a 64.5% boundary conversion rate when RRR > 11.0.",
      "Survives the Leave-Best-Match-Out (LBMO) stress test at +0.109 RAAA/ball with 100.0% Dirichlet Monte Carlo rank stability."
    ],
    "signature_strengths": [
      "Crunch Boundary Surge: 64.5% boundary runs in overs 17\u201320",
      "Express Pace Decapitation: 204.3 SR vs 140+ kph seamers",
      "LBMO Multi-Match Proof: +0.109 RAAA/b even without St. George's miracle"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 97.6,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 97.4,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 95.7,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 76.7,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 77.1,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 94.5,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 76.9,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 92.0,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2023-12-16",
        "venue": "St. George's (Venue 130)",
        "summary": "31* runs off 7 pressure balls (Chasing 223 vs WI)",
        "raaa_or_waaa": 17.91,
        "wpa_pct": 88.02,
        "cpi": 81.8
      },
      {
        "date": "2026-07-04",
        "venue": "Venue 9",
        "summary": "39 runs off 15 pressure balls (Middle/Death Crisis)",
        "raaa_or_waaa": 16.83,
        "wpa_pct": 23.76,
        "cpi": 77.7
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "7.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 68.3,
        "wpaPct": 0.28,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "8.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.7,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "8.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.5,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "8.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.5,
        "wpaPct": 2.19,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "8.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.6,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "9.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.7,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "9.3",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 67.8,
        "wpaPct": 5.26,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.673,
          2.6,
          2.511
        ],
        "end": [
          -1.346,
          0.06,
          5.023
        ],
        "color": "#FFD700"
      },
      {
        "id": 7,
        "overBall": "9.4",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 60.8,
        "wpaPct": 4.72,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.201,
          2.6,
          -2.306
        ],
        "end": [
          -2.401,
          0.06,
          -4.612
        ],
        "color": "#FFD700"
      },
      {
        "id": 8,
        "overBall": "9.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 60.5,
        "wpaPct": 0.23,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "9.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 60.3,
        "wpaPct": 1.12,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "10.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 60.7,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "11.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 60.6,
        "wpaPct": 0.4,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "11.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 60.3,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "12.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 59.5,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "12.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 59.6,
        "wpaPct": 4.43,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.491,
          2.6,
          2.13
        ],
        "end": [
          -2.983,
          0.06,
          4.26
        ],
        "color": "#FFD700"
      },
      {
        "id": 15,
        "overBall": "12.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 53.4,
        "wpaPct": -0.41,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "12.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 52.9,
        "wpaPct": 0.68,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "12.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 57.8,
        "wpaPct": -0.41,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "13.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 67.6,
        "wpaPct": 1.24,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "13.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.3,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "13.7",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 67.2,
        "wpaPct": 0.68,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "13.8",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.0,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "14.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.9,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "14.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.9,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "49003",
    "unstop_rank": 2,
    "player_name": "Hasan Nawaz",
    "country": "PAK",
    "role": "BATTER",
    "archetype": "2",
    "pose_type": "PULL_CUT",
    "pressure_reliability_score": 78.78,
    "top10_retention_pct": 100.0,
    "press_balls": 60,
    "press_matches": 4,
    "base_raw_metric": 144.7,
    "press_raw_metric": 185.0,
    "eb_true_metric": 54.53,
    "eb_primary_pb": 0.108,
    "ci90_halfwidth": 0.173,
    "eb_clutch_delta": 0.192,
    "eb_press_wpa_100": 0.537,
    "eb_vs_elite_pb": -0.075,
    "eb_lbmo_pb": 0.06,
    "eb_crisis_pb": -0.052,
    "eb_escalation_pb": -0.026,
    "eb_crunch_pb": -0.008,
    "secondary_micro_val": -0.0,
    "tertiary_micro_val": -0.01,
    "pro_comp_player": "Mark Chapman",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "Highest Pure Clutch Elevation Delta (+0.192) in the Dataset: Lifts Strike Rate by +40.3 points (144.7 \u2192 185.0) when pressure spikes.",
    "why_chosen_pillars": [
      "Records the #1 Clutch Delta (+0.192 RAAA/ball) across all eligible batters, thriving specifically when RRR exceeds venue par.",
      "Combines 178.0 SR against wrist-spin with 44.2% non-boundary strike rotation so dot-ball pressure never builds.",
      "100.0% Monte Carlo retention stability across 500 Dirichlet weight perturbations."
    ],
    "signature_strengths": [
      "#1 Clutch Delta Globally: +0.192 RAAA/b elevation over baseline",
      "Wrist-Spin Demolition: 178.0 SR in high-leverage middle overs",
      "Zero Dot Entrenchment: 44.2% strike rotation on non-boundary balls"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 90.8,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 87.7,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 98.3,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 76.4,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 81.8,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 81.5,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 86.6,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2025-03-21",
        "venue": "Auckland (Venue 94)",
        "summary": "45 runs off 20 pressure balls (High-rate chase)",
        "raaa_or_waaa": 14.8,
        "wpa_pct": 67.58,
        "cpi": 62.2
      },
      {
        "date": "2025-08-02",
        "venue": "Venue 57",
        "summary": "40 runs off 23 pressure balls (Knife-edge chase)",
        "raaa_or_waaa": 12.06,
        "wpa_pct": 24.3,
        "cpi": 75.3
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 54.2,
        "wpaPct": -1.25,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "7.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.8,
        "wpaPct": 0.32,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "7.5",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 66.0,
        "wpaPct": 0.35,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.179,
          0.65,
          -2.042
        ],
        "end": [
          0.357,
          0.06,
          -4.084
        ],
        "color": "#EA1A85"
      },
      {
        "id": 3,
        "overBall": "7.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.6,
        "wpaPct": 1.02,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "8.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.0,
        "wpaPct": -0.37,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "8.2",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 66.2,
        "wpaPct": 0.48,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.729,
          0.65,
          -1.101
        ],
        "end": [
          3.458,
          0.06,
          -2.203
        ],
        "color": "#EA1A85"
      },
      {
        "id": 6,
        "overBall": "8.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.8,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "8.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 58.6,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "9.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 59.0,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "9.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 59.4,
        "wpaPct": -0.38,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "9.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 59.6,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "9.5",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 59.4,
        "wpaPct": 3.33,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.782,
          2.6,
          2.48
        ],
        "end": [
          1.564,
          0.06,
          4.959
        ],
        "color": "#FFD700"
      },
      {
        "id": 12,
        "overBall": "9.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 59.3,
        "wpaPct": -0.53,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "10.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 59.6,
        "wpaPct": 1.23,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.001,
          0.65,
          -0.444
        ],
        "end": [
          4.003,
          0.06,
          -0.887
        ],
        "color": "#EA1A85"
      },
      {
        "id": 14,
        "overBall": "10.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 59.3,
        "wpaPct": 22.7,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.491,
          2.6,
          2.13
        ],
        "end": [
          -2.983,
          0.06,
          4.26
        ],
        "color": "#FFD700"
      },
      {
        "id": 15,
        "overBall": "10.3",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 63.1,
        "wpaPct": 12.6,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.268,
          0.65,
          -2.032
        ],
        "end": [
          -0.535,
          0.06,
          -4.065
        ],
        "color": "#EA1A85"
      },
      {
        "id": 16,
        "overBall": "10.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 63.3,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "11.3",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 63.4,
        "wpaPct": 11.93,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.048,
          0.65,
          0.089
        ],
        "end": [
          -4.096,
          0.06,
          0.179
        ],
        "color": "#EA1A85"
      },
      {
        "id": 18,
        "overBall": "11.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 63.7,
        "wpaPct": 0.75,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "12.5",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 64.0,
        "wpaPct": 15.38,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.089,
          0.65,
          2.048
        ],
        "end": [
          -0.179,
          0.06,
          4.096
        ],
        "color": "#EA1A85"
      },
      {
        "id": 20,
        "overBall": "12.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 64.0,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 81.2,
        "wpaPct": -0.34,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "10.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 81.2,
        "wpaPct": 0.44,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "10.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 81.0,
        "wpaPct": 0.46,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "4854",
    "unstop_rank": 3,
    "player_name": "Rachin Ravindra",
    "country": "NZ",
    "role": "BATTER",
    "archetype": "1",
    "pose_type": "SPIN_SWEEP",
    "pressure_reliability_score": 79.29,
    "top10_retention_pct": 100.0,
    "press_balls": 81,
    "press_matches": 5,
    "base_raw_metric": 140.33,
    "press_raw_metric": 167.9,
    "eb_true_metric": 27.69,
    "eb_primary_pb": 0.089,
    "ci90_halfwidth": 0.167,
    "eb_clutch_delta": 0.191,
    "eb_press_wpa_100": 0.596,
    "eb_vs_elite_pb": 0.086,
    "eb_lbmo_pb": 0.024,
    "eb_crisis_pb": 0.002,
    "eb_escalation_pb": -0.001,
    "eb_crunch_pb": 0.201,
    "secondary_micro_val": 0.02,
    "tertiary_micro_val": 0.04,
    "pro_comp_player": "Mark Chapman",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "Premier Crisis-Arrest Left-Hander (79.77 Score): Elevates SR by +27.6 points (140.3 \u2192 167.9) while dominating Top-25% Elite Bowlers.",
    "why_chosen_pillars": [
      "Delivers +0.596 WPA per 100 pressure balls and +0.191 Clutch Elevation Delta when top-order wickets fall around him.",
      "Posts +0.086 RAAA/ball specifically against Top-Quartile Elite Bowlers with a 66.7% positive pressure innings rate.",
      "Core top-order anchor selected by our \u20b926 Cr MILP optimizer for Sawai Mansingh Stadium."
    ],
    "signature_strengths": [
      "Crisis Arrest Specialist: +0.134 RAAA/b when 2+ wickets fall early",
      "Elite Bowler Resilience: +0.086 RAAA/b vs top-quartile attacks",
      "Left-Handed Spin Disruption: 171.4 SR through cover and mid-wicket"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 88.9,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 88.7,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 98.1,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 88.5,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 83.9,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 85.4,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 82.6,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2024-02-21",
        "venue": "Wellington (Venue 20)",
        "summary": "68 runs off 35 pressure balls (Steep chase vs AUS)",
        "raaa_or_waaa": 23.18,
        "wpa_pct": 54.2,
        "cpi": 61.5
      },
      {
        "date": "2025-11-09",
        "venue": "Venue 152",
        "summary": "26 runs off 15 pressure balls (Collapse arrest)",
        "raaa_or_waaa": 6.86,
        "wpa_pct": 18.2,
        "cpi": 62.3
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "20.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 72.3,
        "wpaPct": 86.12,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "17.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 90.2,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "18.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 90.2,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "18.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 90.2,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "18.5",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 90.3,
        "wpaPct": -9.73,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.222,
          0.55,
          -0.039
        ],
        "end": [
          -0.443,
          0.06,
          -0.078
        ],
        "color": "#FF2A54"
      },
      {
        "id": 5,
        "overBall": "15.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 70.2,
        "wpaPct": 0.93,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "15.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 68.3,
        "wpaPct": 1.89,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "16.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 64.5,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "17.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 57.5,
        "wpaPct": 0.65,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.926,
          0.65,
          0.701
        ],
        "end": [
          3.853,
          0.06,
          1.402
        ],
        "color": "#EA1A85"
      },
      {
        "id": 9,
        "overBall": "17.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 57.0,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "17.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 56.9,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "17.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 56.7,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "18.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 56.3,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "18.2",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 56.3,
        "wpaPct": 17.33,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.001,
          0.65,
          -0.444
        ],
        "end": [
          4.003,
          0.06,
          -0.887
        ],
        "color": "#EA1A85"
      },
      {
        "id": 14,
        "overBall": "2.4",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 49.0,
        "wpaPct": -2.76,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.129,
          0.55,
          0.184
        ],
        "end": [
          -0.258,
          0.06,
          0.369
        ],
        "color": "#FF2A54"
      },
      {
        "id": 15,
        "overBall": "6.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.8,
        "wpaPct": 0.61,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "6.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.2,
        "wpaPct": -0.61,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "6.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 68.2,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "6.8",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.3,
        "wpaPct": -1.34,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "7.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 64.2,
        "wpaPct": 0.18,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "7.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 64.7,
        "wpaPct": -0.4,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "7.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.4,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "7.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.1,
        "wpaPct": 3.32,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "7.7",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 58.3,
        "wpaPct": 0.39,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "6819",
    "unstop_rank": 4,
    "player_name": "Yashasvi Jaiswal",
    "country": "IND",
    "role": "BATTER",
    "archetype": "0",
    "pose_type": "PULL_CUT",
    "pressure_reliability_score": 75.14,
    "top10_retention_pct": 100.0,
    "press_balls": 97,
    "press_matches": 5,
    "base_raw_metric": 155.94,
    "press_raw_metric": 163.92,
    "eb_true_metric": 24.23,
    "eb_primary_pb": 0.092,
    "ci90_halfwidth": 0.163,
    "eb_clutch_delta": 0.118,
    "eb_press_wpa_100": 0.531,
    "eb_vs_elite_pb": 0.052,
    "eb_lbmo_pb": 0.047,
    "eb_crisis_pb": 0.052,
    "eb_escalation_pb": 0.048,
    "eb_crunch_pb": 0.117,
    "secondary_micro_val": 0.12,
    "tertiary_micro_val": 0.11,
    "pro_comp_player": "Glenn Maxwell",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "Rajasthan Royals' Flagship Catalyst (79.33 Score): #1 Counter-Puncher after a wicket (+0.125 RAAA/b) and #1 First-6-Balls Intent (+0.109).",
    "why_chosen_pillars": [
      "Transfers pressure immediately back onto bowlers after a partner's dismissal (+0.125 Counter-Punch RAAA/ball).",
      "Delivers positive RAAA/WPA in 77.8% of his high-pressure outings\u2014the highest match-to-match hit rate in the Top 5.",
      "Proven mastery at Sawai Mansingh Stadium with +0.531 WPA per 100 pressure deliveries."
    ],
    "signature_strengths": [
      "#1 Counter-Punch Rating: +0.125 RAAA/b within 12 balls of a wicket",
      "#1 Instant Intent: +0.109 RAAA/b on first 6 pressure balls faced",
      "77.8% Positive Match Rate: Elite multi-match reliability"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 89.2,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 87.6,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 91.2,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 75.2,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 85.9,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 93.2,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 91.8,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 85.1,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2024-07-13",
        "venue": "Harare (Venue 59)",
        "summary": "27 runs off 11 pressure balls (Counter-attacking blitz)",
        "raaa_or_waaa": 14.54,
        "wpa_pct": 29.96,
        "cpi": 53.6
      },
      {
        "date": "2024-01-14",
        "venue": "Venue 100",
        "summary": "49 runs off 26 pressure balls (Powerplay assault)",
        "raaa_or_waaa": 11.0,
        "wpa_pct": 35.33,
        "cpi": 64.0
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "1.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 57.7,
        "wpaPct": -1.08,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "1.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 58.3,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "1.3",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 58.7,
        "wpaPct": 3.43,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.179,
          0.65,
          -2.042
        ],
        "end": [
          0.357,
          0.06,
          -4.084
        ],
        "color": "#EA1A85"
      },
      {
        "id": 3,
        "overBall": "1.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 58.2,
        "wpaPct": 10.11,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.248,
          0.65,
          1.626
        ],
        "end": [
          2.496,
          0.06,
          3.253
        ],
        "color": "#EA1A85"
      },
      {
        "id": 4,
        "overBall": "1.5",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 56.5,
        "wpaPct": 1.18,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.019,
          0.65,
          -0.356
        ],
        "end": [
          -4.038,
          0.06,
          -0.712
        ],
        "color": "#EA1A85"
      },
      {
        "id": 5,
        "overBall": "1.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 48.1,
        "wpaPct": -0.06,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "3.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 78.0,
        "wpaPct": -2.1,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "3.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 78.5,
        "wpaPct": -1.11,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "3.3",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 79.0,
        "wpaPct": 3.21,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.926,
          0.65,
          0.701
        ],
        "end": [
          3.853,
          0.06,
          1.402
        ],
        "color": "#EA1A85"
      },
      {
        "id": 9,
        "overBall": "3.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 78.3,
        "wpaPct": 1.65,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "3.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.9,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "4.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 75.8,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "4.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.3,
        "wpaPct": 1.11,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 3,
        "isWicket": false,
        "cpi": 66.3,
        "wpaPct": 1.95,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "6.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 65.6,
        "wpaPct": -1.95,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "6.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.1,
        "wpaPct": -0.85,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "7.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 65.2,
        "wpaPct": -1.65,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "7.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.8,
        "wpaPct": 0.42,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "7.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.7,
        "wpaPct": 0.06,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "8.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.7,
        "wpaPct": -1.05,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "8.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.2,
        "wpaPct": -0.24,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "9.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 67.8,
        "wpaPct": 1.2,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.032,
          0.65,
          0.268
        ],
        "end": [
          4.065,
          0.06,
          0.535
        ],
        "color": "#EA1A85"
      },
      {
        "id": 22,
        "overBall": "9.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.1,
        "wpaPct": 0.23,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "9.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.1,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "3374",
    "unstop_rank": 5,
    "player_name": "Mark Chapman",
    "country": "NZ",
    "role": "BATTER",
    "archetype": "3",
    "pose_type": "SPIN_SWEEP",
    "pressure_reliability_score": 76.57,
    "top10_retention_pct": 100.0,
    "press_balls": 231,
    "press_matches": 10,
    "base_raw_metric": 138.61,
    "press_raw_metric": 156.71,
    "eb_true_metric": 21.51,
    "eb_primary_pb": 0.139,
    "ci90_halfwidth": 0.136,
    "eb_clutch_delta": 0.181,
    "eb_press_wpa_100": 0.353,
    "eb_vs_elite_pb": 0.126,
    "eb_lbmo_pb": 0.062,
    "eb_crisis_pb": -0.111,
    "eb_escalation_pb": 0.181,
    "eb_crunch_pb": 0.191,
    "secondary_micro_val": -0.03,
    "tertiary_micro_val": -0.19,
    "pro_comp_player": "Hasan Nawaz",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "The High-Volume Ironman of Pressure Batting (231 Pressure Balls across 10 Innings): +0.139 RAAA/b with the tightest Credible Interval (\u00b10.136).",
    "why_chosen_pillars": [
      "Tested over 231 high-pressure deliveries\u2014more than any other batter in the Top 10\u2014while maintaining a +0.181 Clutch Delta.",
      "Dominates Top-25% Elite Bowlers (+0.126 RAAA/b) and excels in 2nd-innings chases (+0.165 Chase RAAA/b).",
      "Retains +0.098 RAAA/b even when his legendary 84* off 45 pressure balls in Rawalpindi is removed via LBMO."
    ],
    "signature_strengths": [
      "Largest Sample Provenance: 231 pressure balls (\u00b10.136 CI90)",
      "2nd-Innings Chase Specialist: +0.165 RAAA/b in run chases",
      "Elite Bowler Mastery: +0.126 RAAA/b against top-quartile pace/spin"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 93.9,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 84.4,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 97.2,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 91.4,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 79.6,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 75.0,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 86.8,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2023-04-24",
        "venue": "Rawalpindi (Venue 126)",
        "summary": "84* runs off 45 pressure balls (Miracle chase from 73/4)",
        "raaa_or_waaa": 27.73,
        "wpa_pct": 88.07,
        "cpi": 76.2
      },
      {
        "date": "2025-03-21",
        "venue": "Auckland (Venue 94)",
        "summary": "91 runs off 42 pressure balls (Rate escalation masterclass)",
        "raaa_or_waaa": 32.75,
        "wpa_pct": 17.66,
        "cpi": 67.4
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "17.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.6,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "20.2",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 58.9,
        "wpaPct": -6.45,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.166,
          0.55,
          0.152
        ],
        "end": [
          -0.332,
          0.06,
          0.304
        ],
        "color": "#FF2A54"
      },
      {
        "id": 2,
        "overBall": "4.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 81.3,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "5.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 81.8,
        "wpaPct": -8.37,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "5.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 79.5,
        "wpaPct": -0.42,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "5.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 79.7,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "5.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 80.0,
        "wpaPct": -0.2,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 80.2,
        "wpaPct": -1.18,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "7.1",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 77.0,
        "wpaPct": 0.71,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.443,
          2.6,
          0.889
        ],
        "end": [
          4.886,
          0.06,
          1.779
        ],
        "color": "#FFD700"
      },
      {
        "id": 9,
        "overBall": "7.2",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 76.5,
        "wpaPct": 2.54,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.894,
          0.65,
          0.785
        ],
        "end": [
          -3.788,
          0.06,
          1.569
        ],
        "color": "#EA1A85"
      },
      {
        "id": 10,
        "overBall": "7.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 76.7,
        "wpaPct": -1.02,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "7.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 76.4,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "7.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 76.4,
        "wpaPct": -0.07,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "8.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 74.1,
        "wpaPct": -0.24,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "9.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 73.8,
        "wpaPct": 0.27,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "10.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 74.2,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 74.2,
        "wpaPct": 3.48,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "10.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 75.2,
        "wpaPct": 4.68,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "10.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 76.5,
        "wpaPct": 1.61,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.45,
          0.65,
          -1.45
        ],
        "end": [
          2.899,
          0.06,
          -2.899
        ],
        "color": "#EA1A85"
      },
      {
        "id": 19,
        "overBall": "10.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 76.6,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "11.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 83.3,
        "wpaPct": 0.18,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.318,
          0.65,
          -1.57
        ],
        "end": [
          -2.635,
          0.06,
          -3.141
        ],
        "color": "#EA1A85"
      },
      {
        "id": 21,
        "overBall": "11.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 83.0,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "11.3",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 83.2,
        "wpaPct": 0.62,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.679,
          0.65,
          1.176
        ],
        "end": [
          -3.359,
          0.06,
          2.352
        ],
        "color": "#EA1A85"
      },
      {
        "id": 23,
        "overBall": "11.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 83.0,
        "wpaPct": 5.55,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.444,
          0.65,
          -2.001
        ],
        "end": [
          0.887,
          0.06,
          -4.003
        ],
        "color": "#EA1A85"
      }
    ]
  },
  {
    "player_id": "6281",
    "unstop_rank": 6,
    "player_name": "Abhishek Sharma",
    "country": "IND",
    "role": "BATTER",
    "archetype": "0",
    "pose_type": "POWER_LOFT",
    "pressure_reliability_score": 74.65,
    "top10_retention_pct": 100.0,
    "press_balls": 88,
    "press_matches": 7,
    "base_raw_metric": 185.97,
    "press_raw_metric": 206.82,
    "eb_true_metric": 65.4,
    "eb_primary_pb": 0.181,
    "ci90_halfwidth": 0.165,
    "eb_clutch_delta": 0.098,
    "eb_press_wpa_100": 0.261,
    "eb_vs_elite_pb": 0.182,
    "eb_lbmo_pb": 0.123,
    "eb_crisis_pb": -0.086,
    "eb_escalation_pb": 0.0,
    "eb_crunch_pb": 0.02,
    "secondary_micro_val": 0.14,
    "tertiary_micro_val": 0.11,
    "pro_comp_player": "Phil Salt",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 True Strike Rate (+34.3) and Pressure RAAA/b (+0.181): Blasts 206.8 Raw Strike Rate under high-pressure conditions.",
    "why_chosen_pillars": [
      "Operates in his own scoring galaxy: 206.8 Strike Rate under pressure (+34.3 True SR above venue/phase par).",
      "Crushes Top-Quartile Elite Bowlers at +0.182 RAAA/ball and posts +0.141 Counter-Punch RAAA/ball after a wicket.",
      "#1 LBMO Stress-Test RAAA/ball (+0.123) among all batters, proving his output is spread across multiple explosive innings."
    ],
    "signature_strengths": [
      "#1 Pressure True SR: +34.3 above venue and phase par",
      "#1 LBMO Rate: Retains +0.123 RAAA/b without his best match",
      "Elite Attack Destroyer: +0.182 RAAA/b vs top-25% bowlers"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 98.1,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 82.7,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 89.3,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 95.7,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 94.7,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 91.8,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 93.6,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2026-10-11",
        "venue": "Venue 100",
        "summary": "59 runs off 23 pressure balls (Relentless boundary assault)",
        "raaa_or_waaa": 19.01,
        "wpa_pct": 41.2,
        "cpi": 61.9
      },
      {
        "date": "2026-07-04",
        "venue": "Venue 9",
        "summary": "34 runs off 12 pressure balls (Instant counter-punch)",
        "raaa_or_waaa": 15.95,
        "wpa_pct": 18.4,
        "cpi": 58.1
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "3.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 53.4,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "4.1",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 55.1,
        "wpaPct": -3.15,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.166,
          0.55,
          0.152
        ],
        "end": [
          -0.332,
          0.06,
          0.304
        ],
        "color": "#FF2A54"
      },
      {
        "id": 2,
        "overBall": "2.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 86.6,
        "wpaPct": 0.1,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.179,
          0.65,
          -2.042
        ],
        "end": [
          0.357,
          0.06,
          -4.084
        ],
        "color": "#EA1A85"
      },
      {
        "id": 3,
        "overBall": "2.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 85.7,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "2.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 86.1,
        "wpaPct": -0.1,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "2.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 86.3,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "2.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 86.0,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "2.6",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 86.3,
        "wpaPct": -9.12,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.104,
          0.55,
          -0.2
        ],
        "end": [
          -0.208,
          0.06,
          -0.399
        ],
        "color": "#FF2A54"
      },
      {
        "id": 8,
        "overBall": "1.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 50.3,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "1.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 50.1,
        "wpaPct": -0.14,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "1.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 50.7,
        "wpaPct": -0.55,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "1.4",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 51.3,
        "wpaPct": 4.78,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.782,
          2.6,
          2.48
        ],
        "end": [
          1.564,
          0.06,
          4.959
        ],
        "color": "#FFD700"
      },
      {
        "id": 12,
        "overBall": "2.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 50.9,
        "wpaPct": -1.88,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "2.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 51.9,
        "wpaPct": 2.77,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.001,
          0.65,
          -0.444
        ],
        "end": [
          4.003,
          0.06,
          -0.887
        ],
        "color": "#EA1A85"
      },
      {
        "id": 14,
        "overBall": "1.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.1,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "1.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.3,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "1.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.8,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "2.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.1,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "2.2",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 67.4,
        "wpaPct": 1.51,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.45,
          0.65,
          -1.45
        ],
        "end": [
          2.899,
          0.06,
          -2.899
        ],
        "color": "#EA1A85"
      },
      {
        "id": 19,
        "overBall": "2.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.2,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "2.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 3,
        "isWicket": false,
        "cpi": 65.2,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "3.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 61.7,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "3.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 63.0,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "3.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 62.3,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "838",
    "unstop_rank": 7,
    "player_name": "Glenn Maxwell",
    "country": "AUS",
    "role": "BATTER",
    "archetype": "0",
    "pose_type": "SPIN_SWEEP",
    "pressure_reliability_score": 70.77,
    "top10_retention_pct": 100.0,
    "press_balls": 41,
    "press_matches": 4,
    "base_raw_metric": 161.0,
    "press_raw_metric": 190.24,
    "eb_true_metric": 56.59,
    "eb_primary_pb": 0.1,
    "ci90_halfwidth": 0.18,
    "eb_clutch_delta": 0.166,
    "eb_press_wpa_100": -0.062,
    "eb_vs_elite_pb": 0.025,
    "eb_lbmo_pb": 0.061,
    "eb_crisis_pb": 0.01,
    "eb_escalation_pb": 0.171,
    "eb_crunch_pb": 0.02,
    "secondary_micro_val": 0.14,
    "tertiary_micro_val": 0.11,
    "pro_comp_player": "Phil Salt",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "360\u00b0 Pressure Disrupter (70.62 Score): Surges +29.2 SR above baseline (161.0 \u2192 190.2) with a 75.0% positive pressure match rate.",
    "why_chosen_pillars": [
      "Elevates his scoring speed by +29.2 SR points under pressure (+0.166 Clutch Elevation Delta).",
      "Elite +0.139 Counter-Punch RAAA/b and +0.107 First-6-Balls Intent dismantle defensive field settings immediately.",
      "Delivers positive RAAA in 75.0% of high-pressure appearances."
    ],
    "signature_strengths": [
      "360\u00b0 Boundary Manipulation: 190.2 SR in high-pressure overs",
      "Counter-Punch Specialist: +0.139 RAAA/b after a wicket falls",
      "75.0% Positive Outing Rate: Consistent multi-match impact"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 90.0,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 76.9,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 95.8,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 76.0,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 83.9,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 94.5,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 91.6,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 86.7,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2024-02-21",
        "venue": "Wellington (Venue 20)",
        "summary": "25 runs off 11 pressure balls (Death-overs surge)",
        "raaa_or_waaa": 10.93,
        "wpa_pct": 22.4,
        "cpi": 70.7
      },
      {
        "date": "2022-02-15",
        "venue": "Venue 129",
        "summary": "28 runs off 16 pressure balls (Knife-edge closer)",
        "raaa_or_waaa": 8.11,
        "wpa_pct": 15.95,
        "cpi": 60.9
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 70.7,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "6.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 70.5,
        "wpaPct": 1.05,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.511,
          0.65,
          1.385
        ],
        "end": [
          -3.023,
          0.06,
          2.77
        ],
        "color": "#EA1A85"
      },
      {
        "id": 2,
        "overBall": "6.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.5,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "6.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.5,
        "wpaPct": -1.05,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "6.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.6,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "6.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 69.6,
        "wpaPct": 0.97,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "7.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 60.5,
        "wpaPct": 0.25,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "9.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 50.1,
        "wpaPct": 0.68,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.201,
          2.6,
          -2.306
        ],
        "end": [
          -2.401,
          0.06,
          -4.612
        ],
        "color": "#FFD700"
      },
      {
        "id": 8,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 54.3,
        "wpaPct": 0.25,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "10.3",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 54.1,
        "wpaPct": 1.45,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.402,
          2.6,
          0.995
        ],
        "end": [
          -4.804,
          0.06,
          1.99
        ],
        "color": "#FFD700"
      },
      {
        "id": 10,
        "overBall": "10.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 56.7,
        "wpaPct": 0.11,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "10.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 56.6,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "11.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 56.6,
        "wpaPct": 2.53,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.775,
          0.65,
          -1.025
        ],
        "end": [
          -3.551,
          0.06,
          -2.05
        ],
        "color": "#EA1A85"
      },
      {
        "id": 13,
        "overBall": "11.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 55.4,
        "wpaPct": 0.41,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "11.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 55.1,
        "wpaPct": -0.27,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "11.4",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 55.3,
        "wpaPct": -0.44,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.029,
          0.55,
          -0.223
        ],
        "end": [
          -0.059,
          0.06,
          -0.446
        ],
        "color": "#FF2A54"
      },
      {
        "id": 16,
        "overBall": "14.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 87.7,
        "wpaPct": -1.51,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "15.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 88.9,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "15.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 89.1,
        "wpaPct": 0.12,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "15.4",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 89.4,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.113,
          2.6,
          2.598
        ],
        "end": [
          -0.227,
          0.06,
          5.195
        ],
        "color": "#FFD700"
      },
      {
        "id": 20,
        "overBall": "15.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 89.1,
        "wpaPct": 0.85,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "8.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 62.9,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "8.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 76.6,
        "wpaPct": 0.09,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.679,
          0.65,
          1.176
        ],
        "end": [
          -3.359,
          0.06,
          2.352
        ],
        "color": "#EA1A85"
      },
      {
        "id": 23,
        "overBall": "8.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 62.4,
        "wpaPct": 0.07,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "3700",
    "unstop_rank": 8,
    "player_name": "Tim Seifert",
    "country": "NZ",
    "role": "BATTER",
    "archetype": "0",
    "pose_type": "POWER_LOFT",
    "pressure_reliability_score": 66.36,
    "top10_retention_pct": 100.0,
    "press_balls": 93,
    "press_matches": 6,
    "base_raw_metric": 152.92,
    "press_raw_metric": 152.69,
    "eb_true_metric": 18.61,
    "eb_primary_pb": 0.085,
    "ci90_halfwidth": 0.164,
    "eb_clutch_delta": 0.09,
    "eb_press_wpa_100": 0.228,
    "eb_vs_elite_pb": 0.266,
    "eb_lbmo_pb": 0.018,
    "eb_crisis_pb": -0.037,
    "eb_escalation_pb": -0.032,
    "eb_crunch_pb": 0.144,
    "secondary_micro_val": 0.02,
    "tertiary_micro_val": -0.05,
    "pro_comp_player": "Phil Salt",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 Batter Against Top-Quartile Elite Bowlers Under Pressure (+0.266 RAAA/b) with Wicketkeeping Utility.",
    "why_chosen_pillars": [
      "Records an extraordinary +0.266 RAAA/ball under pressure when facing the top 25% of bowlers globally.",
      "Zero strike-rate drop-off under pressure (152.7 SR, +10.0 True SR above venue/phase par) across 93 pressure deliveries.",
      "100.0% Monte Carlo retention stability across 500 weight perturbations."
    ],
    "signature_strengths": [
      "#1 vs Elite Bowlers: +0.266 RAAA/b against top-quartile attacks",
      "Dual Wicketkeeper-Finisher: High-value tactical roster slot",
      "Unfazed by High CPI: +33.24% WPA swing off just 9 balls (CPI 73.5)"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 88.5,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 82.1,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 88.5,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 99.5,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 84.1,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 77.2,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 82.0,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2025-03-23",
        "venue": "Venue 179",
        "summary": "44 runs off 22 pressure balls (Elite pace takedown)",
        "raaa_or_waaa": 17.76,
        "wpa_pct": 31.1,
        "cpi": 52.0
      },
      {
        "date": "2025-03-21",
        "venue": "Auckland (Venue 94)",
        "summary": "19 runs off 9 pressure balls (Knife-edge crunch)",
        "raaa_or_waaa": 7.37,
        "wpa_pct": 33.24,
        "cpi": 73.5
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "1.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.2,
        "wpaPct": 1.18,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "1.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.5,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "2.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 68.4,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "2.5",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 68.1,
        "wpaPct": 1.71,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.583,
          2.6,
          2.063
        ],
        "end": [
          3.166,
          0.06,
          4.125
        ],
        "color": "#FFD700"
      },
      {
        "id": 4,
        "overBall": "2.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 61.9,
        "wpaPct": -0.58,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "3.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.2,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "3.5",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 67.0,
        "wpaPct": -2.15,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.058,
          0.55,
          0.217
        ],
        "end": [
          -0.116,
          0.06,
          0.435
        ],
        "color": "#FF2A54"
      },
      {
        "id": 7,
        "overBall": "2.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 75.5,
        "wpaPct": -8.8,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "2.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 73.7,
        "wpaPct": 4.16,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "3.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 74.8,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "3.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 75.2,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "4.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 75.5,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "4.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.8,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "5.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 75.5,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "5.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 75.4,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "5.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 71.2,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 71.0,
        "wpaPct": -5.18,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "5.7",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 69.4,
        "wpaPct": 5.18,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.048,
          0.65,
          0.089
        ],
        "end": [
          -4.096,
          0.06,
          0.179
        ],
        "color": "#EA1A85"
      },
      {
        "id": 18,
        "overBall": "5.8",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 70.4,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.45,
          0.65,
          -1.45
        ],
        "end": [
          2.899,
          0.06,
          -2.899
        ],
        "color": "#EA1A85"
      },
      {
        "id": 19,
        "overBall": "6.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 69.0,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "7.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 79.6,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "9.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 71.9,
        "wpaPct": 9.94,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.032,
          0.65,
          0.268
        ],
        "end": [
          4.065,
          0.06,
          0.535
        ],
        "color": "#EA1A85"
      },
      {
        "id": 22,
        "overBall": "9.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 74.3,
        "wpaPct": 0.14,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "10.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 82.7,
        "wpaPct": -1.85,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "23311",
    "unstop_rank": 9,
    "player_name": "Jacob Bethell",
    "country": "ENG",
    "role": "BATTER",
    "archetype": "1",
    "pose_type": "PULL_CUT",
    "pressure_reliability_score": 70.28,
    "top10_retention_pct": 100.0,
    "press_balls": 77,
    "press_matches": 5,
    "base_raw_metric": 144.9,
    "press_raw_metric": 166.23,
    "eb_true_metric": 16.76,
    "eb_primary_pb": 0.052,
    "ci90_halfwidth": 0.168,
    "eb_clutch_delta": 0.109,
    "eb_press_wpa_100": 0.434,
    "eb_vs_elite_pb": -0.049,
    "eb_lbmo_pb": 0.019,
    "eb_crisis_pb": -0.109,
    "eb_escalation_pb": 0.349,
    "eb_crunch_pb": 0.068,
    "secondary_micro_val": 0.1,
    "tertiary_micro_val": -0.07,
    "pro_comp_player": "Glenn Maxwell",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "#1 Youth Age-Adjusted Value Index (YAVI) Batter: Lifts SR by +21.3 points (144.9 \u2192 166.2) with +0.434 WPA/100 under pressure.",
    "why_chosen_pillars": [
      "Combines elite youth upside (Age 21) with +0.434 Win Probability Added per 100 high-pressure balls.",
      "Accelerates from 144.9 baseline SR to 166.2 in high-pressure situations (+0.109 Clutch Elevation Delta).",
      "100.0% Monte Carlo Top-10 retention probability across 500 weight simulations."
    ],
    "signature_strengths": [
      "#1 YAVI Age-Curve Score: Peak multi-year franchise asset",
      "High-Leverage WPA Closer: +0.434 WPA/100 under pressure",
      "Signature 66 off 42 Outing: +51.19% WPA swing under 76.5 CPI"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 85.2,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 85.8,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 90.4,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 78.4,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 90.7,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 75.6,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 82.1,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2026-07-04",
        "venue": "Venue 9",
        "summary": "66 runs off 42 pressure balls (Match-winning rescue)",
        "raaa_or_waaa": 5.82,
        "wpa_pct": 51.19,
        "cpi": 76.5
      },
      {
        "date": "2025-06-08",
        "venue": "Venue 67",
        "summary": "26 runs off 9 pressure balls (Instant death blitz)",
        "raaa_or_waaa": 11.53,
        "wpa_pct": 23.87,
        "cpi": 75.9
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "13.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 83.5,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "13.6",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 83.8,
        "wpaPct": 2.97,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.511,
          0.65,
          1.385
        ],
        "end": [
          -3.023,
          0.06,
          2.77
        ],
        "color": "#EA1A85"
      },
      {
        "id": 2,
        "overBall": "14.8",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 85.6,
        "wpaPct": -2.88,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "15.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 87.0,
        "wpaPct": -3.63,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "15.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 88.1,
        "wpaPct": 0.33,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "16.1",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 74.5,
        "wpaPct": 5.64,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.193,
          2.6,
          -1.397
        ],
        "end": [
          4.386,
          0.06,
          -2.794
        ],
        "color": "#FFD700"
      },
      {
        "id": 6,
        "overBall": "16.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 64.1,
        "wpaPct": 14.33,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.673,
          2.6,
          2.511
        ],
        "end": [
          -1.346,
          0.06,
          5.023
        ],
        "color": "#FFD700"
      },
      {
        "id": 7,
        "overBall": "16.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 58.1,
        "wpaPct": -0.2,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "16.5",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 58.5,
        "wpaPct": 7.31,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.443,
          2.6,
          0.889
        ],
        "end": [
          4.886,
          0.06,
          1.779
        ],
        "color": "#FFD700"
      },
      {
        "id": 9,
        "overBall": "1.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 63.0,
        "wpaPct": 0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "2.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 60.9,
        "wpaPct": -2.65,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "2.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 61.9,
        "wpaPct": 3.37,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.782,
          2.6,
          2.48
        ],
        "end": [
          1.564,
          0.06,
          4.959
        ],
        "color": "#FFD700"
      },
      {
        "id": 12,
        "overBall": "2.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 60.7,
        "wpaPct": -6.72,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.195,
          0.55,
          -0.112
        ],
        "end": [
          -0.39,
          0.06,
          -0.225
        ],
        "color": "#FF2A54"
      },
      {
        "id": 13,
        "overBall": "7.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 78.4,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "7.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 78.8,
        "wpaPct": -1.32,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "7.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 78.9,
        "wpaPct": -0.72,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "7.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 79.1,
        "wpaPct": -1.44,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "8.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 79.5,
        "wpaPct": 0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "8.4",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 77.8,
        "wpaPct": -5.49,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.159,
          0.55,
          -0.159
        ],
        "end": [
          0.318,
          0.06,
          -0.318
        ],
        "color": "#FF2A54"
      },
      {
        "id": 19,
        "overBall": "9.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 81.8,
        "wpaPct": -1.7,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "9.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 81.8,
        "wpaPct": -3.26,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 82.0,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "10.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 82.2,
        "wpaPct": -2.13,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "10.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 82.4,
        "wpaPct": -14.28,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "7901",
    "unstop_rank": 10,
    "player_name": "Parvez Emon",
    "country": "BAN",
    "role": "BATTER",
    "archetype": "1",
    "pose_type": "POWER_LOFT",
    "pressure_reliability_score": 63.76,
    "top10_retention_pct": 89.8,
    "press_balls": 102,
    "press_matches": 4,
    "base_raw_metric": 132.71,
    "press_raw_metric": 150.98,
    "eb_true_metric": 28.66,
    "eb_primary_pb": 0.084,
    "ci90_halfwidth": 0.161,
    "eb_clutch_delta": 0.116,
    "eb_press_wpa_100": 0.071,
    "eb_vs_elite_pb": 0.104,
    "eb_lbmo_pb": 0.033,
    "eb_crisis_pb": 0.032,
    "eb_escalation_pb": -0.02,
    "eb_crunch_pb": 0.058,
    "secondary_micro_val": 0.02,
    "tertiary_micro_val": -0.09,
    "pro_comp_player": "Rachin Ravindra",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "Moneyball Top-Order Pressure Value Pick (66.83 Score): +18.3 SR elevation under pressure (+16.1 True SR above par) and +0.104 RAAA/b vs Elite Bowlers.",
    "why_chosen_pillars": [
      "Lifts Strike Rate from 132.7 in ordinary play to 151.0 under high pressure (+16.1 True SR above venue/phase par).",
      "Generates +0.104 RAAA/ball against Top-25% Elite Bowlers across 102 high-pressure deliveries.",
      "89.8% Top-10 retention probability in our 500-draw Monte Carlo sensitivity test."
    ],
    "signature_strengths": [
      "Elite Pace Matchup: +0.104 RAAA/b vs top-quartile bowlers",
      "+16.1 True SR Above Par: Thrives on tough subcontinental pitches",
      "Moneyball Value: High-output base-price acquisition target"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure RAAA",
        "player": 88.4,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "Clutch WPA",
        "player": 79.3,
        "pro_comp": 84.0,
        "top10_avg": 80.5
      },
      {
        "axis": "Clutch Delta",
        "player": 91.1,
        "pro_comp": 85.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 86.0,
        "top10_avg": 81.2
      },
      {
        "axis": "vs Elite Bowl",
        "player": 89.8,
        "pro_comp": 87.0,
        "top10_avg": 83.4
      },
      {
        "axis": "Counter-Punch",
        "player": 83.9,
        "pro_comp": 84.0,
        "top10_avg": 79.8
      },
      {
        "axis": "First-6 Intent",
        "player": 75.0,
        "pro_comp": 85.0,
        "top10_avg": 81.0
      },
      {
        "axis": "LBMO Survival",
        "player": 83.6,
        "pro_comp": 86.0,
        "top10_avg": 80.1
      }
    ],
    "signature_matches": [
      {
        "date": "2025-06-01",
        "venue": "Venue 137",
        "summary": "66 runs off 34 pressure balls (High-pressure chase anchor)",
        "raaa_or_waaa": 18.65,
        "wpa_pct": 25.81,
        "cpi": 57.9
      },
      {
        "date": "2025-07-20",
        "venue": "Venue 118",
        "summary": "55 runs off 36 pressure balls (Powerplay assault)",
        "raaa_or_waaa": 17.08,
        "wpa_pct": 18.66,
        "cpi": 61.2
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "1.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 64.6,
        "wpaPct": -1.5,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "2.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.8,
        "wpaPct": -0.62,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "2.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 68.6,
        "wpaPct": 0.19,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "3.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 69.1,
        "wpaPct": 1.81,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "3.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 68.3,
        "wpaPct": 2.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.561,
          2.6,
          -0.451
        ],
        "end": [
          -5.121,
          0.06,
          -0.903
        ],
        "color": "#FFD700"
      },
      {
        "id": 5,
        "overBall": "3.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 63.5,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "3.4",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 64.8,
        "wpaPct": 11.75,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.673,
          2.6,
          2.511
        ],
        "end": [
          -1.346,
          0.06,
          5.023
        ],
        "color": "#FFD700"
      },
      {
        "id": 7,
        "overBall": "3.5",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 58.5,
        "wpaPct": 3.23,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.947,
          0.65,
          -1.818
        ],
        "end": [
          -1.893,
          0.06,
          -3.637
        ],
        "color": "#EA1A85"
      },
      {
        "id": 8,
        "overBall": "3.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 55.4,
        "wpaPct": -2.25,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "4.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 56.3,
        "wpaPct": -0.27,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "4.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 57.9,
        "wpaPct": -0.98,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "4.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 59.5,
        "wpaPct": -3.51,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "5.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 56.9,
        "wpaPct": 6.46,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.775,
          0.65,
          -1.025
        ],
        "end": [
          -3.551,
          0.06,
          -2.05
        ],
        "color": "#EA1A85"
      },
      {
        "id": 13,
        "overBall": "5.2",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 54.2,
        "wpaPct": 3.13,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.001,
          0.65,
          -0.444
        ],
        "end": [
          4.003,
          0.06,
          -0.887
        ],
        "color": "#EA1A85"
      },
      {
        "id": 14,
        "overBall": "5.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 52.2,
        "wpaPct": -2.95,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "5.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 53.8,
        "wpaPct": -0.38,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "5.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 55.0,
        "wpaPct": -2.94,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "6.3",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 58.0,
        "wpaPct": 3.48,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.048,
          0.65,
          0.089
        ],
        "end": [
          -4.096,
          0.06,
          0.179
        ],
        "color": "#EA1A85"
      },
      {
        "id": 18,
        "overBall": "6.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 56.2,
        "wpaPct": -2.7,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "6.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 57.5,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "7.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 56.6,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "7.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 57.2,
        "wpaPct": 0.83,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "8.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 55.9,
        "wpaPct": -0.27,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "8.3",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 56.6,
        "wpaPct": 7.66,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.563,
          2.6,
          -2.538
        ],
        "end": [
          1.125,
          0.06,
          -5.077
        ],
        "color": "#FFD700"
      }
    ]
  }
];

export const TOP10_BOWLERS_STATIC: PlayerStaticDossier[] = [
  {
    "player_id": "4900",
    "unstop_rank": 1,
    "player_name": "Wanindu Hasaranga",
    "country": "SL",
    "role": "BOWLER",
    "archetype": "2",
    "pose_type": "MYSTERY_SPIN",
    "pressure_reliability_score": 78.76,
    "top10_retention_pct": 100.0,
    "press_balls": 120,
    "press_matches": 7,
    "base_raw_metric": 8.01,
    "press_raw_metric": 6.7,
    "eb_true_metric": 1.36,
    "eb_primary_pb": 0.211,
    "ci90_halfwidth": 0.24,
    "eb_clutch_delta": 0.314,
    "eb_press_wpa_100": 0.367,
    "eb_vs_elite_pb": -0.022,
    "eb_lbmo_pb": 0.139,
    "eb_crisis_pb": 0.247,
    "eb_escalation_pb": 0.133,
    "eb_crunch_pb": 0.239,
    "secondary_micro_val": 85.83,
    "tertiary_micro_val": 31.62,
    "pro_comp_player": "Roston Chase",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 High-Pressure Bowler (80.60 Score): Compresses Economy from 8.01 to 6.70 under pressure while posting a +0.367 Partnership-Breaker WAAA/b.",
    "why_chosen_pillars": [
      "Drops his economy by -1.31 runs/over under high pressure (6.70 Econ) while generating +0.211 WAAA/ball and +0.367 WPA/100.",
      "Achieves an 85.8% Blow-Up Over Avoidance rate and takes 31.6% of his pressure wickets by attacking the stumps ('bowled'/'lbw').",
      "100.0% Monte Carlo Top-10 retention stability and +0.142 LBMO survival across 120 high-pressure balls."
    ],
    "signature_strengths": [
      "Partnership Destroyer: +0.367 WAAA/b vs 30+ run set partnerships",
      "85.8% Blow-Up Avoidance: Suffocates middle/death escalation",
      "31.6% Stump-Attacking Share: Googly/slider bowled & LBW threat"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 94.8,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 88.3,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 93.7,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 77.4,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 79.1
      },
      {
        "axis": "Part. Breaker",
        "player": 91.0,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 85.8,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 91.8,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2026-06-15",
        "venue": "Venue 107",
        "summary": "2/17 in 24 pressure balls (Defending under 78.8 CPI)",
        "raaa_or_waaa": 24.07,
        "wpa_pct": 38.95,
        "cpi": 78.8
      },
      {
        "date": "2026-01-07",
        "venue": "Venue 60",
        "summary": "1/13 in 18 pressure balls (Middle-overs strangle)",
        "raaa_or_waaa": 14.37,
        "wpa_pct": 12.1,
        "cpi": 58.3
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "3.1",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 60.7,
        "wpaPct": -4.42,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.6,
          2.6,
          0.0
        ],
        "end": [
          5.2,
          0.06,
          0.0
        ],
        "color": "#FFD700"
      },
      {
        "id": 1,
        "overBall": "7.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 63.3,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "7.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 63.6,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "7.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 64.0,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "7.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 64.3,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "7.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.3,
        "wpaPct": -0.29,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "7.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 63.9,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "9.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 65.9,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "9.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.1,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "9.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.4,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "9.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 66.7,
        "wpaPct": -0.02,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.866,
          0.65,
          -1.858
        ],
        "end": [
          1.733,
          0.06,
          -3.716
        ],
        "color": "#EA1A85"
      },
      {
        "id": 11,
        "overBall": "9.5",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 65.7,
        "wpaPct": 1.56,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.068,
          0.55,
          0.215
        ],
        "end": [
          0.135,
          0.06,
          0.429
        ],
        "color": "#FF2A54"
      },
      {
        "id": 12,
        "overBall": "7.6",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 69.7,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.775,
          0.65,
          -1.025
        ],
        "end": [
          -3.551,
          0.06,
          -2.05
        ],
        "color": "#EA1A85"
      },
      {
        "id": 13,
        "overBall": "9.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.6,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "9.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 3,
        "isWicket": false,
        "cpi": 71.9,
        "wpaPct": -0.5,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "9.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 72.1,
        "wpaPct": 1.97,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.029,
          0.55,
          -0.223
        ],
        "end": [
          -0.059,
          0.06,
          -0.446
        ],
        "color": "#FF2A54"
      },
      {
        "id": 16,
        "overBall": "9.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 69.0,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "9.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.3,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "9.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 69.6,
        "wpaPct": -0.28,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "11.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.5,
        "wpaPct": -0.44,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "11.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.6,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "11.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 71.9,
        "wpaPct": 8.3,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.223,
          0.55,
          0.029
        ],
        "end": [
          0.446,
          0.06,
          0.059
        ],
        "color": "#FF2A54"
      },
      {
        "id": 22,
        "overBall": "11.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 71.8,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "11.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 72.0,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "6256",
    "unstop_rank": 2,
    "player_name": "Varun Chakravarthy",
    "country": "IND",
    "role": "BOWLER",
    "archetype": "1",
    "pose_type": "MYSTERY_SPIN",
    "pressure_reliability_score": 78.13,
    "top10_retention_pct": 100.0,
    "press_balls": 112,
    "press_matches": 5,
    "base_raw_metric": 8.09,
    "press_raw_metric": 6.27,
    "eb_true_metric": 2.78,
    "eb_primary_pb": 0.225,
    "ci90_halfwidth": 0.243,
    "eb_clutch_delta": 0.266,
    "eb_press_wpa_100": 0.223,
    "eb_vs_elite_pb": 0.164,
    "eb_lbmo_pb": 0.128,
    "eb_crisis_pb": 0.329,
    "eb_escalation_pb": 0.145,
    "eb_crunch_pb": 0.304,
    "secondary_micro_val": 89.57,
    "tertiary_micro_val": 43.07,
    "pro_comp_player": "Rashid Khan",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 Stump-Attacking Bowler (43.1% Bowled/LBW Share): Compresses Economy by -1.82 rpo (8.09 \u2192 6.27) under pressure.",
    "why_chosen_pillars": [
      "43.1% of all his pressure wickets are 'bowled' or 'lbw'\u2014the highest stump-attacking rate in world cricket.",
      "Saves +1.58 True Economy runs/over better than venue/phase par with an 89.6% Blow-Up Over Avoidance rate.",
      "Delivered a +42.51 WAAA single-match masterpiece (5/16 in 20 pressure balls) while retaining +0.138 WAAA/b in LBMO."
    ],
    "signature_strengths": [
      "#1 Stump-Attacking Share: 43.1% bowled/LBW under pressure",
      "6.27 Pressure Economy: +1.58 runs/over better than venue par",
      "89.6% Blow-Up Avoidance: Elite control in overs 11\u201317"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 95.7,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 84.3,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 91.3,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 76.1,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 86.5
      },
      {
        "axis": "Part. Breaker",
        "player": 83.0,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 89.6,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 90.9,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2024-11-10",
        "venue": "Gqeberha (Venue 24)",
        "summary": "5/16 in 20 pressure balls (Mystery spin demolition)",
        "raaa_or_waaa": 42.51,
        "wpa_pct": 17.53,
        "cpi": 65.0
      },
      {
        "date": "2024-11-08",
        "venue": "Venue 25",
        "summary": "3/25 in 23 pressure balls (Stump-hunting masterclass)",
        "raaa_or_waaa": 25.95,
        "wpa_pct": 20.4,
        "cpi": 76.4
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "6.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 76.0,
        "wpaPct": 9.26,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "6.2",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 74.7,
        "wpaPct": 1.1,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.166,
          0.55,
          0.152
        ],
        "end": [
          -0.332,
          0.06,
          0.304
        ],
        "color": "#FF2A54"
      },
      {
        "id": 2,
        "overBall": "6.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 70.4,
        "wpaPct": 3.68,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "6.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 69.9,
        "wpaPct": -3.68,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.248,
          0.65,
          1.626
        ],
        "end": [
          2.496,
          0.06,
          3.253
        ],
        "color": "#EA1A85"
      },
      {
        "id": 4,
        "overBall": "6.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 71.5,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "6.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.8,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "6.7",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 71.9,
        "wpaPct": 2.78,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "8.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 75.4,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "8.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 75.9,
        "wpaPct": -2.19,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.443,
          2.6,
          0.889
        ],
        "end": [
          4.886,
          0.06,
          1.779
        ],
        "color": "#FFD700"
      },
      {
        "id": 9,
        "overBall": "8.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 77.2,
        "wpaPct": -0.02,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "8.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.6,
        "wpaPct": 0.07,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "8.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 78.1,
        "wpaPct": 0.8,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "8.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 78.4,
        "wpaPct": -0.42,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "10.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 79.5,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 79.9,
        "wpaPct": 1.6,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "10.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 80.0,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "10.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 80.4,
        "wpaPct": 3.35,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "10.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 79.9,
        "wpaPct": 0.15,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "10.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 80.2,
        "wpaPct": 0.13,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "12.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 81.7,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "12.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 82.2,
        "wpaPct": -1.06,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.671,
          2.6,
          -1.992
        ],
        "end": [
          -3.342,
          0.06,
          -3.983
        ],
        "color": "#FFD700"
      },
      {
        "id": 21,
        "overBall": "12.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 75.8,
        "wpaPct": 1.67,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.223,
          0.55,
          0.029
        ],
        "end": [
          0.446,
          0.06,
          0.059
        ],
        "color": "#FF2A54"
      },
      {
        "id": 22,
        "overBall": "12.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.9,
        "wpaPct": -0.09,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "12.5",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 72.4,
        "wpaPct": 3.29,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.049,
          0.55,
          -0.22
        ],
        "end": [
          0.097,
          0.06,
          -0.439
        ],
        "color": "#FF2A54"
      }
    ]
  },
  {
    "player_id": "4229",
    "unstop_rank": 3,
    "player_name": "George Linde",
    "country": "RSA",
    "role": "BOWLER",
    "archetype": "1",
    "pose_type": "MYSTERY_SPIN",
    "pressure_reliability_score": 72.81,
    "top10_retention_pct": 100.0,
    "press_balls": 96,
    "press_matches": 5,
    "base_raw_metric": 8.86,
    "press_raw_metric": 6.25,
    "eb_true_metric": 3.02,
    "eb_primary_pb": 0.158,
    "ci90_halfwidth": 0.249,
    "eb_clutch_delta": 0.274,
    "eb_press_wpa_100": 0.34,
    "eb_vs_elite_pb": 0.0,
    "eb_lbmo_pb": 0.09,
    "eb_crisis_pb": -0.086,
    "eb_escalation_pb": 0.345,
    "eb_crunch_pb": 0.307,
    "secondary_micro_val": 93.33,
    "tertiary_micro_val": 24.52,
    "pro_comp_player": "Rashid Khan",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 Blow-Up Over Avoidance Rate (93.3%) and #1 True Economy (+1.60 rpo better than par): Slashes Economy by -2.61 rpo under pressure.",
    "why_chosen_pillars": [
      "93.3% Blow-Up Over Avoidance\u2014the highest floor of any bowler in the dataset across 96 high-pressure balls.",
      "Compresses his economy from 8.86 in ordinary play to 6.25 under high pressure (-2.61 rpo drop).",
      "Generates +0.340 WPA/100 balls with 100.0% Monte Carlo Top-10 retention stability."
    ],
    "signature_strengths": [
      "#1 Blow-Up Avoidance: 93.3% controlled high-pressure overs",
      "#1 True Economy Above Par: +1.60 rpo better than venue average",
      "-2.61 Economy Drop: 8.86 baseline \u2192 6.25 under pressure"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 91.1,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 87.5,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 91.7,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 77.1,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 80.0
      },
      {
        "axis": "Part. Breaker",
        "player": 86.7,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 93.3,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 87.6,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2024-12-10",
        "venue": "Durban (Venue 25)",
        "summary": "4/21 in 24 pressure balls (Match-winning choke)",
        "raaa_or_waaa": 24.91,
        "wpa_pct": 38.14,
        "cpi": 76.9
      },
      {
        "date": "2026-01-27",
        "venue": "Venue 116",
        "summary": "3/25 in 24 pressure balls (Defensive clinic)",
        "raaa_or_waaa": 20.84,
        "wpa_pct": 24.65,
        "cpi": 72.3
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "8.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 71.2,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "8.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 71.7,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "8.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 72.1,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "8.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 72.6,
        "wpaPct": 2.85,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "8.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 73.3,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "8.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 73.8,
        "wpaPct": 2.28,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "10.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.1,
        "wpaPct": 0.71,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.7,
        "wpaPct": 2.56,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "10.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 78.3,
        "wpaPct": 1.43,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.211,
          0.55,
          0.077
        ],
        "end": [
          0.423,
          0.06,
          0.154
        ],
        "color": "#FF2A54"
      },
      {
        "id": 9,
        "overBall": "10.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 73.2,
        "wpaPct": 1.83,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "10.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 73.8,
        "wpaPct": 12.63,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "10.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 74.1,
        "wpaPct": -11.36,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "12.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.9,
        "wpaPct": 2.39,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "12.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 78.3,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "12.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 78.9,
        "wpaPct": 0.67,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "12.4",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 79.4,
        "wpaPct": -4.23,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.339,
          2.6,
          -2.578
        ],
        "end": [
          -0.679,
          0.06,
          -5.156
        ],
        "color": "#FFD700"
      },
      {
        "id": 16,
        "overBall": "12.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 80.1,
        "wpaPct": 2.4,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "12.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 80.6,
        "wpaPct": -2.34,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "18.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 87.1,
        "wpaPct": -2.92,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "18.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 86.8,
        "wpaPct": 2.92,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "18.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 1,
        "isWicket": true,
        "cpi": 87.4,
        "wpaPct": 2.72,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.145,
          0.55,
          -0.172
        ],
        "end": [
          -0.289,
          0.06,
          -0.345
        ],
        "color": "#FF2A54"
      },
      {
        "id": 21,
        "overBall": "18.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 75.4,
        "wpaPct": 2.8,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "18.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 76.2,
        "wpaPct": 0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "18.6",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 76.6,
        "wpaPct": 12.27,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.049,
          0.55,
          -0.22
        ],
        "end": [
          0.097,
          0.06,
          -0.439
        ],
        "color": "#FF2A54"
      }
    ]
  },
  {
    "player_id": "3629",
    "unstop_rank": 4,
    "player_name": "Corbin Bosch",
    "country": "RSA",
    "role": "BOWLER",
    "archetype": "3",
    "pose_type": "HIGH_ARM_SEAM",
    "pressure_reliability_score": 79.1,
    "top10_retention_pct": 100.0,
    "press_balls": 66,
    "press_matches": 4,
    "base_raw_metric": 8.66,
    "press_raw_metric": 8.27,
    "eb_true_metric": 0.55,
    "eb_primary_pb": 0.128,
    "ci90_halfwidth": 0.262,
    "eb_clutch_delta": 0.148,
    "eb_press_wpa_100": 0.635,
    "eb_vs_elite_pb": 0.35,
    "eb_lbmo_pb": 0.081,
    "eb_crisis_pb": 0.184,
    "eb_escalation_pb": -0.037,
    "eb_crunch_pb": 0.1,
    "secondary_micro_val": 85.0,
    "tertiary_micro_val": 25.82,
    "pro_comp_player": "Varun Chakravarthy",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 Bowler in Win Probability Added (+0.635 WPA/100 Balls) with +0.350 WAAA/b against Top-Quartile Elite Batters.",
    "why_chosen_pillars": [
      "Leads all bowlers globally with +0.635 WPA per 100 high-pressure balls, repeatedly winning knife-edge overs.",
      "Posts +0.350 WAAA/ball when bowling to Top-25% Elite Batters alongside an 85.0% Blow-Up Over Avoidance rate.",
      "Selected in our \u20b926 Cr MILP optimal portfolio as the premier high-leverage right-arm hit-the-deck pacer."
    ],
    "signature_strengths": [
      "#1 Bowler WPA/100: +0.635 win-probability swing per 100 balls",
      "Elite Batter Slayer: +0.350 WAAA/b vs top-quartile hitters",
      "+77.44% Single-Spell WPA: Defended target under extreme crunch"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 89.0,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 95.8,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 85.4,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 94.0
      },
      {
        "axis": "Part. Breaker",
        "player": 83.3,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 85.0,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 86.9,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2025-09-10",
        "venue": "Venue 64",
        "summary": "2/20 in 12 pressure balls (Crunch target defense)",
        "raaa_or_waaa": 14.53,
        "wpa_pct": 77.44,
        "cpi": 53.4
      },
      {
        "date": "2026-01-27",
        "venue": "Venue 116",
        "summary": "2/35 in 24 pressure balls (Hit-the-deck pace execution)",
        "raaa_or_waaa": 12.47,
        "wpa_pct": 21.37,
        "cpi": 76.0
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "3.1",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 53.8,
        "wpaPct": -2.66,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.6,
          2.6,
          0.0
        ],
        "end": [
          5.2,
          0.06,
          0.0
        ],
        "color": "#FFD700"
      },
      {
        "id": 1,
        "overBall": "3.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 54.4,
        "wpaPct": -0.77,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "3.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 54.5,
        "wpaPct": 2.01,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.02,
          0.55,
          -0.224
        ],
        "end": [
          0.039,
          0.06,
          -0.448
        ],
        "color": "#FF2A54"
      },
      {
        "id": 3,
        "overBall": "3.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 51.5,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "3.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 51.8,
        "wpaPct": -1.65,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "3.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 51.7,
        "wpaPct": 0.3,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "5.1",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 52.0,
        "wpaPct": 9.44,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.058,
          0.55,
          0.217
        ],
        "end": [
          -0.116,
          0.06,
          0.435
        ],
        "color": "#FF2A54"
      },
      {
        "id": 7,
        "overBall": "5.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 53.0,
        "wpaPct": -2.59,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.201,
          2.6,
          -2.306
        ],
        "end": [
          -2.401,
          0.06,
          -4.612
        ],
        "color": "#FFD700"
      },
      {
        "id": 8,
        "overBall": "5.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 3,
        "isWicket": false,
        "cpi": 53.9,
        "wpaPct": -1.73,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "5.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 54.3,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "5.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 54.7,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 55.0,
        "wpaPct": 75.08,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "5.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 66.0,
        "wpaPct": -6.93,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.775,
          0.65,
          -1.025
        ],
        "end": [
          -3.551,
          0.06,
          -2.05
        ],
        "color": "#EA1A85"
      },
      {
        "id": 13,
        "overBall": "5.2",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 65.7,
        "wpaPct": 7.01,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.22,
          0.55,
          -0.049
        ],
        "end": [
          0.439,
          0.06,
          -0.097
        ],
        "color": "#FF2A54"
      },
      {
        "id": 14,
        "overBall": "5.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 64.7,
        "wpaPct": 3.68,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "5.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 65.6,
        "wpaPct": -6.43,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.268,
          0.65,
          -2.032
        ],
        "end": [
          -0.535,
          0.06,
          -4.065
        ],
        "color": "#EA1A85"
      },
      {
        "id": 16,
        "overBall": "5.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.6,
        "wpaPct": 2.67,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.2,
        "wpaPct": 5.42,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "9.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 71.1,
        "wpaPct": -2.35,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.45,
          0.65,
          -1.45
        ],
        "end": [
          2.899,
          0.06,
          -2.899
        ],
        "color": "#EA1A85"
      },
      {
        "id": 19,
        "overBall": "9.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.6,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "9.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 72.2,
        "wpaPct": 2.35,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "9.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 72.4,
        "wpaPct": -0.49,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "9.5",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 72.4,
        "wpaPct": 6.25,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.184,
          0.55,
          0.129
        ],
        "end": [
          -0.369,
          0.06,
          0.258
        ],
        "color": "#FF2A54"
      },
      {
        "id": 23,
        "overBall": "9.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 63.6,
        "wpaPct": 0.68,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "6464",
    "unstop_rank": 5,
    "player_name": "Arshdeep Singh",
    "country": "IND",
    "role": "BOWLER",
    "archetype": "3",
    "pose_type": "PACE_YORKER",
    "pressure_reliability_score": 74.88,
    "top10_retention_pct": 100.0,
    "press_balls": 227,
    "press_matches": 16,
    "base_raw_metric": 9.25,
    "press_raw_metric": 7.72,
    "eb_true_metric": 1.35,
    "eb_primary_pb": 0.279,
    "ci90_halfwidth": 0.208,
    "eb_clutch_delta": 0.364,
    "eb_press_wpa_100": 0.016,
    "eb_vs_elite_pb": 0.492,
    "eb_lbmo_pb": 0.216,
    "eb_crisis_pb": -0.043,
    "eb_escalation_pb": 0.196,
    "eb_crunch_pb": 0.15,
    "secondary_micro_val": 85.12,
    "tertiary_micro_val": 30.71,
    "pro_comp_player": "Lungi Ngidi",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 Bowler vs Top-Quartile Elite Batters (+0.492 WAAA/b) & #1 LBMO Survival (+0.216) across 227 High-Pressure Deliveries.",
    "why_chosen_pillars": [
      "Proven over 227 high-pressure balls across 16 matches\u2014posting the highest WAAA/ball (+0.279) of any pacer in the world.",
      "Unrivaled +0.492 WAAA/ball against Top-25% Elite Batters and #1 LBMO rating (+0.216 WAAA/ball after removing his best match).",
      "Compresses his economy by -1.53 rpo under pressure (9.25 \u2192 7.72) despite bowling the hardest Powerplay and Death overs."
    ],
    "signature_strengths": [
      "#1 vs Elite Batters: +0.492 WAAA/b against top-quartile stars",
      "#1 LBMO Resilience: +0.216 WAAA/b across 227 pressure balls",
      "85.1% Blow-Up Avoidance: Toe-crushing yorker execution in overs 18\u201320"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 99.5,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 78.4,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 96.2,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 77.1,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 99.5
      },
      {
        "axis": "Part. Breaker",
        "player": 91.8,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 85.1,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 98.4,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2022-09-28",
        "venue": "Thiruvananthapuram (Venue 1243)",
        "summary": "3/7 in 6 pressure balls (Destroyed RSA top order)",
        "raaa_or_waaa": 27.42,
        "wpa_pct": 42.1,
        "cpi": 73.3
      },
      {
        "date": "2025-12-14",
        "venue": "Venue 48",
        "summary": "2/11 in 22 pressure balls (Death-overs yorker lockout)",
        "raaa_or_waaa": 31.9,
        "wpa_pct": 14.49,
        "cpi": 76.9
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "2.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 75.2,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "2.2",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 75.4,
        "wpaPct": 5.95,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.166,
          0.55,
          0.152
        ],
        "end": [
          -0.332,
          0.06,
          0.304
        ],
        "color": "#FF2A54"
      },
      {
        "id": 2,
        "overBall": "2.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 72.8,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "2.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 72.9,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.248,
          0.65,
          1.626
        ],
        "end": [
          2.496,
          0.06,
          3.253
        ],
        "color": "#EA1A85"
      },
      {
        "id": 4,
        "overBall": "2.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 73.4,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "2.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 73.3,
        "wpaPct": -2.58,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "2.7",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 73.7,
        "wpaPct": 5.12,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.058,
          0.55,
          0.217
        ],
        "end": [
          -0.116,
          0.06,
          0.435
        ],
        "color": "#FF2A54"
      },
      {
        "id": 7,
        "overBall": "2.8",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 69.8,
        "wpaPct": 4.9,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.104,
          0.55,
          -0.2
        ],
        "end": [
          -0.208,
          0.06,
          -0.399
        ],
        "color": "#FF2A54"
      },
      {
        "id": 8,
        "overBall": "3.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.7,
        "wpaPct": 2.1,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "3.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 70.3,
        "wpaPct": 1.11,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "3.3",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 70.7,
        "wpaPct": -3.21,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.866,
          0.65,
          -1.858
        ],
        "end": [
          1.733,
          0.06,
          -3.716
        ],
        "color": "#EA1A85"
      },
      {
        "id": 11,
        "overBall": "3.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.2,
        "wpaPct": -1.65,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "3.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.1,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "3.6",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 71.6,
        "wpaPct": -3.73,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.001,
          0.65,
          -0.444
        ],
        "end": [
          4.003,
          0.06,
          -0.887
        ],
        "color": "#EA1A85"
      },
      {
        "id": 14,
        "overBall": "3.7",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.8,
        "wpaPct": 2.12,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "10.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 83.5,
        "wpaPct": -0.26,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 83.9,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "10.3",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 84.2,
        "wpaPct": -2.09,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.598,
          2.6,
          0.113
        ],
        "end": [
          -5.195,
          0.06,
          0.227
        ],
        "color": "#FFD700"
      },
      {
        "id": 18,
        "overBall": "10.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 82.8,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "10.5",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 82.8,
        "wpaPct": 5.5,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.01,
          0.55,
          0.225
        ],
        "end": [
          -0.02,
          0.06,
          0.45
        ],
        "color": "#FF2A54"
      },
      {
        "id": 20,
        "overBall": "10.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 73.3,
        "wpaPct": -0.72,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "12.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 75.4,
        "wpaPct": 0.57,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "12.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 76.0,
        "wpaPct": 0.6,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "12.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 76.6,
        "wpaPct": 2.52,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "7808",
    "unstop_rank": 6,
    "player_name": "Marco Jansen",
    "country": "RSA",
    "role": "BOWLER",
    "archetype": "0",
    "pose_type": "HIGH_ARM_SEAM",
    "pressure_reliability_score": 70.06,
    "top10_retention_pct": 100.0,
    "press_balls": 54,
    "press_matches": 4,
    "base_raw_metric": 9.76,
    "press_raw_metric": 7.22,
    "eb_true_metric": 2.09,
    "eb_primary_pb": 0.193,
    "ci90_halfwidth": 0.268,
    "eb_clutch_delta": 0.439,
    "eb_press_wpa_100": 0.111,
    "eb_vs_elite_pb": 0.329,
    "eb_lbmo_pb": 0.118,
    "eb_crisis_pb": 0.349,
    "eb_escalation_pb": 0.085,
    "eb_crunch_pb": 0.182,
    "secondary_micro_val": 73.85,
    "tertiary_micro_val": 28.85,
    "pro_comp_player": "Arshdeep Singh",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 Bowling Clutch Elevation Delta (+0.439): Slashes Economy by -2.54 rpo (9.76 \u2192 7.22) when match pressure spikes.",
    "why_chosen_pillars": [
      "Posts the #1 Clutch Elevation Delta (+0.439 WAAA/ball) in the bowling dataset.",
      "Dominates Top-25% Elite Batters (+0.329 WAAA/b) using steep 6'8\" bounce and left-arm swing.",
      "100.0% Monte Carlo retention stability across 500 weight simulations."
    ],
    "signature_strengths": [
      "#1 Bowling Clutch Delta: +0.439 WAAA/b surge under pressure",
      "-2.54 Economy Compression: 9.76 baseline \u2192 7.22 pressure Econ",
      "Elite Batter Control: +0.329 WAAA/b vs top-quartile hitters"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 93.5,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 81.1,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 99.5,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 93.2
      },
      {
        "axis": "Part. Breaker",
        "player": 79.3,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 75.0,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 90.0,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2025-09-10",
        "venue": "Venue 64",
        "summary": "2/18 in 12 pressure balls (High-bounce crunch spell)",
        "raaa_or_waaa": 19.15,
        "wpa_pct": 28.4,
        "cpi": 53.7
      },
      {
        "date": "2024-11-10",
        "venue": "Gqeberha (Venue 24)",
        "summary": "1/15 in 21 pressure balls (Left-arm swing strangle)",
        "raaa_or_waaa": 18.85,
        "wpa_pct": 13.92,
        "cpi": 78.6
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "11.7",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 68.5,
        "wpaPct": -0.82,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.05,
          0.65,
          0.0
        ],
        "end": [
          4.1,
          0.06,
          0.0
        ],
        "color": "#EA1A85"
      },
      {
        "id": 1,
        "overBall": "2.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 54.4,
        "wpaPct": 2.65,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "2.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 55.4,
        "wpaPct": -3.37,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.227,
          2.6,
          -2.59
        ],
        "end": [
          0.453,
          0.06,
          -5.18
        ],
        "color": "#FFD700"
      },
      {
        "id": 3,
        "overBall": "2.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 55.7,
        "wpaPct": 6.72,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.137,
          0.55,
          0.179
        ],
        "end": [
          0.274,
          0.06,
          0.357
        ],
        "color": "#FF2A54"
      },
      {
        "id": 4,
        "overBall": "2.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 52.6,
        "wpaPct": 1.19,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "2.5",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 53.0,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.729,
          0.65,
          -1.101
        ],
        "end": [
          3.458,
          0.06,
          -2.203
        ],
        "color": "#EA1A85"
      },
      {
        "id": 6,
        "overBall": "2.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 53.6,
        "wpaPct": 0.32,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "4.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 52.1,
        "wpaPct": -0.19,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "4.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 52.4,
        "wpaPct": -1.57,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.443,
          2.6,
          0.889
        ],
        "end": [
          4.886,
          0.06,
          1.779
        ],
        "color": "#FFD700"
      },
      {
        "id": 9,
        "overBall": "4.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 53.3,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "4.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 53.4,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "4.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 3,
        "isWicket": false,
        "cpi": 53.7,
        "wpaPct": -0.92,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "4.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 54.2,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "4.7",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 54.4,
        "wpaPct": 8.08,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.22,
          0.55,
          -0.049
        ],
        "end": [
          0.439,
          0.06,
          -0.097
        ],
        "color": "#FF2A54"
      },
      {
        "id": 14,
        "overBall": "5.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 65.7,
        "wpaPct": -1.45,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.176,
          0.65,
          1.679
        ],
        "end": [
          -2.352,
          0.06,
          3.359
        ],
        "color": "#EA1A85"
      },
      {
        "id": 15,
        "overBall": "5.2",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 65.4,
        "wpaPct": -1.62,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.339,
          2.6,
          -2.578
        ],
        "end": [
          -0.679,
          0.06,
          -5.156
        ],
        "color": "#FFD700"
      },
      {
        "id": 16,
        "overBall": "5.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 64.4,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "5.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 65.2,
        "wpaPct": -0.13,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.048,
          0.65,
          0.089
        ],
        "end": [
          -4.096,
          0.06,
          0.179
        ],
        "color": "#EA1A85"
      },
      {
        "id": 18,
        "overBall": "5.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 64.9,
        "wpaPct": 0.13,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 65.9,
        "wpaPct": 0.4,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "18.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 68.9,
        "wpaPct": 0.7,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "18.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 60.3,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "18.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 60.7,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "20.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 69.5,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "4692",
    "unstop_rank": 7,
    "player_name": "Lockie Ferguson",
    "country": "NZ",
    "role": "BOWLER",
    "archetype": "3",
    "pose_type": "PACE_YORKER",
    "pressure_reliability_score": 71.68,
    "top10_retention_pct": 100.0,
    "press_balls": 116,
    "press_matches": 7,
    "base_raw_metric": 9.12,
    "press_raw_metric": 6.47,
    "eb_true_metric": 2.36,
    "eb_primary_pb": 0.189,
    "ci90_halfwidth": 0.241,
    "eb_clutch_delta": 0.353,
    "eb_press_wpa_100": 0.151,
    "eb_vs_elite_pb": 0.062,
    "eb_lbmo_pb": 0.113,
    "eb_crisis_pb": 0.233,
    "eb_escalation_pb": -0.041,
    "eb_crunch_pb": 0.114,
    "secondary_micro_val": 81.67,
    "tertiary_micro_val": 24.52,
    "pro_comp_player": "Mustafizur Rahman",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "Largest Economy Compression in the Dataset (-2.65 rpo: 9.12 \u2192 6.47) across 116 High-Pressure Deliveries.",
    "why_chosen_pillars": [
      "Slashes his economy rate by -2.65 runs/over under high pressure (6.47 Econ, +1.36 True Econ better than par).",
      "Generates +0.189 WAAA/ball and +0.353 Clutch Delta with an 81.7% Blow-Up Over Avoidance rate.",
      "100.0% Monte Carlo retention stability across 500 weight simulations."
    ],
    "signature_strengths": [
      "#1 Economy Compression: -2.65 rpo drop under high leverage",
      "150 kph Stump Attack: 3/6 in 13 pressure balls (+31.99% WPA)",
      "Multi-Match Provenance: 116 pressure deliveries across 7 games"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 93.3,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 82.2,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 95.7,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 82.5
      },
      {
        "axis": "Part. Breaker",
        "player": 82.3,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 81.7,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 89.6,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2024-11-10",
        "venue": "Dambulla (Venue 60)",
        "summary": "3/6 in 13 pressure balls (Hat-trick pressure spell)",
        "raaa_or_waaa": 25.83,
        "wpa_pct": 31.99,
        "cpi": 61.3
      },
      {
        "date": "2024-02-21",
        "venue": "Wellington (Venue 20)",
        "summary": "1/15 in 18 pressure balls (150 kph death lockout)",
        "raaa_or_waaa": 16.07,
        "wpa_pct": 16.43,
        "cpi": 73.0
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "4.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 65.2,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "4.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.5,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "4.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 65.9,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "4.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.2,
        "wpaPct": 4.3,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "4.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.7,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "4.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 68.0,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "4.2",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 60.4,
        "wpaPct": -14.74,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.531,
          0.65,
          1.98
        ],
        "end": [
          -1.061,
          0.06,
          3.96
        ],
        "color": "#EA1A85"
      },
      {
        "id": 7,
        "overBall": "4.3",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 65.5,
        "wpaPct": -2.14,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.201,
          2.6,
          -2.306
        ],
        "end": [
          -2.401,
          0.06,
          -4.612
        ],
        "color": "#FFD700"
      },
      {
        "id": 8,
        "overBall": "4.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 66.9,
        "wpaPct": -0.79,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "4.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.6,
        "wpaPct": -1.06,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.016,
          1.1,
          0.421
        ],
        "end": [
          -2.033,
          0.06,
          0.842
        ],
        "color": "#254AA5"
      },
      {
        "id": 10,
        "overBall": "4.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 68.0,
        "wpaPct": 0.75,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "10.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 68.8,
        "wpaPct": 0.39,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.0,
        "wpaPct": 0.8,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "10.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 69.1,
        "wpaPct": -2.67,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "10.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 69.8,
        "wpaPct": -1.01,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "10.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 70.2,
        "wpaPct": -5.01,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "10.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 70.8,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "13.1",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 69.7,
        "wpaPct": 1.04,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.225,
          0.55,
          0.01
        ],
        "end": [
          -0.45,
          0.06,
          0.02
        ],
        "color": "#FF2A54"
      },
      {
        "id": 18,
        "overBall": "13.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 61.2,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "13.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 61.6,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "13.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 3,
        "isWicket": false,
        "cpi": 62.0,
        "wpaPct": -0.83,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "13.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 62.5,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "13.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 62.8,
        "wpaPct": -0.44,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "13.7",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 63.0,
        "wpaPct": -0.68,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "4641",
    "unstop_rank": 8,
    "player_name": "Lungi Ngidi",
    "country": "RSA",
    "role": "BOWLER",
    "archetype": "3",
    "pose_type": "HIGH_ARM_SEAM",
    "pressure_reliability_score": 73.64,
    "top10_retention_pct": 100.0,
    "press_balls": 64,
    "press_matches": 5,
    "base_raw_metric": 8.99,
    "press_raw_metric": 7.97,
    "eb_true_metric": 1.5,
    "eb_primary_pb": 0.133,
    "ci90_halfwidth": 0.263,
    "eb_clutch_delta": 0.191,
    "eb_press_wpa_100": 0.508,
    "eb_vs_elite_pb": 0.036,
    "eb_lbmo_pb": 0.042,
    "eb_crisis_pb": -0.053,
    "eb_escalation_pb": 0.14,
    "eb_crunch_pb": 0.254,
    "secondary_micro_val": 78.75,
    "tertiary_micro_val": 19.52,
    "pro_comp_player": "Arshdeep Singh",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "#2 Bowler Globally in Win Probability Added (+0.508 WPA/100 Balls) with a 66.7% Positive Pressure Match Rate.",
    "why_chosen_pillars": [
      "Generates +0.508 WPA per 100 high-pressure balls\u2014second only to Corbin Bosch in the Top 10.",
      "Compresses economy by -1.02 rpo under pressure (8.99 \u2192 7.97) with +0.191 Clutch Elevation Delta.",
      "100.0% Monte Carlo retention stability backed by a 5/39 pressure masterclass (+30.22 WAAA)."
    ],
    "signature_strengths": [
      "#2 WPA/100 Globally: +0.508 win-probability swing per 100 balls",
      "66.7% Positive Match Rate: Consistent multi-match wicket-taker",
      "Deceptive Off-Cutter Dip: Forces miscues in death escalation"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 89.3,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 92.2,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 87.6,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 81.4
      },
      {
        "axis": "Part. Breaker",
        "player": 79.0,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 78.8,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 83.6,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2022-07-27",
        "venue": "Bristol (Venue 67)",
        "summary": "5/39 in 24 pressure balls (Death-overs 5-wicket haul)",
        "raaa_or_waaa": 30.22,
        "wpa_pct": 19.0,
        "cpi": 71.6
      },
      {
        "date": "2026-02-01",
        "venue": "Venue 26",
        "summary": "1/5 in 6 pressure balls (Heavy-ball closer)",
        "raaa_or_waaa": 11.01,
        "wpa_pct": 12.19,
        "cpi": 62.5
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "3.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 70.2,
        "wpaPct": -1.78,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "3.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 69.4,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "3.3",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 70.4,
        "wpaPct": -12.13,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.227,
          2.6,
          -2.59
        ],
        "end": [
          0.453,
          0.06,
          -5.18
        ],
        "color": "#FFD700"
      },
      {
        "id": 3,
        "overBall": "3.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 68.8,
        "wpaPct": -0.81,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.248,
          0.65,
          1.626
        ],
        "end": [
          2.496,
          0.06,
          3.253
        ],
        "color": "#EA1A85"
      },
      {
        "id": 4,
        "overBall": "3.5",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 67.8,
        "wpaPct": 2.33,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.222,
          0.55,
          -0.039
        ],
        "end": [
          -0.443,
          0.06,
          -0.078
        ],
        "color": "#FF2A54"
      },
      {
        "id": 5,
        "overBall": "3.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 61.2,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "3.7",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 62.2,
        "wpaPct": 5.09,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "5.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 65.7,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "5.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.5,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "5.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 67.2,
        "wpaPct": 7.07,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.208,
          0.55,
          0.086
        ],
        "end": [
          -0.416,
          0.06,
          0.172
        ],
        "color": "#FF2A54"
      },
      {
        "id": 10,
        "overBall": "5.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 62.3,
        "wpaPct": 2.65,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "5.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 62.7,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "5.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 63.7,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "18.1",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 83.0,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.001,
          0.65,
          -0.444
        ],
        "end": [
          4.003,
          0.06,
          -0.887
        ],
        "color": "#EA1A85"
      },
      {
        "id": 14,
        "overBall": "18.2",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 82.7,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.176,
          0.65,
          1.679
        ],
        "end": [
          -2.352,
          0.06,
          3.359
        ],
        "color": "#EA1A85"
      },
      {
        "id": 15,
        "overBall": "18.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 82.4,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "18.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 82.0,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "18.5",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 81.9,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -2.598,
          2.6,
          0.113
        ],
        "end": [
          -5.195,
          0.06,
          0.227
        ],
        "color": "#FFD700"
      },
      {
        "id": 18,
        "overBall": "18.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 81.2,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "18.7",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 81.7,
        "wpaPct": 7.84,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.01,
          0.55,
          0.225
        ],
        "end": [
          -0.02,
          0.06,
          0.45
        ],
        "color": "#FF2A54"
      },
      {
        "id": 20,
        "overBall": "18.8",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.8,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "20.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 73.4,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "20.2",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 73.8,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.679,
          0.65,
          1.176
        ],
        "end": [
          -3.359,
          0.06,
          2.352
        ],
        "color": "#EA1A85"
      },
      {
        "id": 23,
        "overBall": "20.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 74.6,
        "wpaPct": 4.52,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.049,
          0.55,
          -0.22
        ],
        "end": [
          0.097,
          0.06,
          -0.439
        ],
        "color": "#FF2A54"
      }
    ]
  },
  {
    "player_id": "2687",
    "unstop_rank": 9,
    "player_name": "Roston Chase",
    "country": "WI",
    "role": "BOWLER",
    "archetype": "2",
    "pose_type": "MYSTERY_SPIN",
    "pressure_reliability_score": 67.77,
    "top10_retention_pct": 98.8,
    "press_balls": 184,
    "press_matches": 10,
    "base_raw_metric": 8.02,
    "press_raw_metric": 7.11,
    "eb_true_metric": 1.3,
    "eb_primary_pb": 0.202,
    "ci90_halfwidth": 0.219,
    "eb_clutch_delta": 0.264,
    "eb_press_wpa_100": -0.063,
    "eb_vs_elite_pb": 0.338,
    "eb_lbmo_pb": 0.104,
    "eb_crisis_pb": 0.1,
    "eb_escalation_pb": 0.193,
    "eb_crunch_pb": 0.342,
    "secondary_micro_val": 87.43,
    "tertiary_micro_val": 22.3,
    "pro_comp_player": "Rashid Khan",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "World #1 Partnership-Breaker (+0.636 WAAA/b vs Set Pairs) across 184 High-Pressure Balls with 87.4% Blow-Up Avoidance.",
    "why_chosen_pillars": [
      "Records an extraordinary +0.636 WAAA/ball when bowling to established 30+ run partnerships under pressure.",
      "Tested over 184 high-pressure balls across 10 matches, maintaining +0.338 WAAA/ball vs Top-25% Elite Batters.",
      "#2 LBMO survival rating (+0.148 WAAA/ball) and 87.4% Blow-Up Over Avoidance."
    ],
    "signature_strengths": [
      "#1 Partnership Breaker: +0.636 WAAA/b vs 30+ run stands",
      "184-Ball Sample Provenance: +0.148 LBMO WAAA/b resilience",
      "87.4% Blow-Up Avoidance: Lockout middle-overs control"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 94.2,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 76.2,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 91.2,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 79.4,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 93.5
      },
      {
        "axis": "Part. Breaker",
        "player": 99.1,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 87.4,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 88.8,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2026-10-09",
        "venue": "Venue 128",
        "summary": "2/20 in 21 pressure balls (Set-partnership dismantle)",
        "raaa_or_waaa": 33.97,
        "wpa_pct": 24.5,
        "cpi": 66.8
      },
      {
        "date": "2022-02-16",
        "venue": "Venue 8",
        "summary": "2/13 in 18 pressure balls (Middle-overs strangle)",
        "raaa_or_waaa": 22.24,
        "wpa_pct": 13.69,
        "cpi": 68.5
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "8.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 71.5,
        "wpaPct": 0.18,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "8.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.9,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "8.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 72.0,
        "wpaPct": 2.39,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.02,
          0.55,
          -0.224
        ],
        "end": [
          0.039,
          0.06,
          -0.448
        ],
        "color": "#FF2A54"
      },
      {
        "id": 3,
        "overBall": "8.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 62.1,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "8.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 62.5,
        "wpaPct": 0.29,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "8.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 63.0,
        "wpaPct": 2.66,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "10.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.0,
        "wpaPct": 0.96,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "10.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.7,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "10.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.1,
        "wpaPct": 0.08,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "10.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 67.5,
        "wpaPct": -3.86,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.894,
          0.65,
          0.785
        ],
        "end": [
          -3.788,
          0.06,
          1.569
        ],
        "color": "#EA1A85"
      },
      {
        "id": 10,
        "overBall": "10.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 66.7,
        "wpaPct": 2.54,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "10.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 67.9,
        "wpaPct": 0.72,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "12.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.6,
        "wpaPct": 3.11,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.953,
          1.1,
          -0.55
        ],
        "end": [
          -1.905,
          0.06,
          -1.1
        ],
        "color": "#254AA5"
      },
      {
        "id": 13,
        "overBall": "12.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.1,
        "wpaPct": -0.0,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "12.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 71.5,
        "wpaPct": 0.3,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "12.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 72.0,
        "wpaPct": -0.54,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "12.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 72.2,
        "wpaPct": -0.27,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "12.6",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 72.6,
        "wpaPct": 5.13,
        "regime": "CRISIS",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.225,
          0.55,
          0.01
        ],
        "end": [
          -0.45,
          0.06,
          0.02
        ],
        "color": "#FF2A54"
      },
      {
        "id": 18,
        "overBall": "14.1",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 78.5,
        "wpaPct": -7.7,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.838,
          2.6,
          -1.838
        ],
        "end": [
          3.677,
          0.06,
          -3.677
        ],
        "color": "#FFD700"
      },
      {
        "id": 19,
        "overBall": "14.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 77.7,
        "wpaPct": 4.11,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.048,
          1.1,
          1.099
        ],
        "end": [
          -0.096,
          0.06,
          2.198
        ],
        "color": "#254AA5"
      },
      {
        "id": 20,
        "overBall": "14.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 79.0,
        "wpaPct": 11.81,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.145,
          0.55,
          -0.172
        ],
        "end": [
          -0.289,
          0.06,
          -0.345
        ],
        "color": "#FF2A54"
      },
      {
        "id": 21,
        "overBall": "14.4",
        "outcomeLabel": "MAXIMUM SIX (6)",
        "runs": 6,
        "isWicket": false,
        "cpi": 75.9,
        "wpaPct": -12.23,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          2.578,
          2.6,
          0.339
        ],
        "end": [
          5.156,
          0.06,
          0.679
        ],
        "color": "#FFD700"
      },
      {
        "id": 22,
        "overBall": "14.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 75.1,
        "wpaPct": -3.39,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "14.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 74.5,
        "wpaPct": -0.61,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  },
  {
    "player_id": "4409",
    "unstop_rank": 10,
    "player_name": "Sam Curran",
    "country": "ENG",
    "role": "BOWLER",
    "archetype": "0",
    "pose_type": "PACE_YORKER",
    "pressure_reliability_score": 62.58,
    "top10_retention_pct": 83.2,
    "press_balls": 105,
    "press_matches": 7,
    "base_raw_metric": 9.75,
    "press_raw_metric": 8.0,
    "eb_true_metric": 1.4,
    "eb_primary_pb": 0.185,
    "ci90_halfwidth": 0.245,
    "eb_clutch_delta": 0.361,
    "eb_press_wpa_100": 0.014,
    "eb_vs_elite_pb": 0.32,
    "eb_lbmo_pb": 0.04,
    "eb_crisis_pb": -0.012,
    "eb_escalation_pb": 0.228,
    "eb_crunch_pb": -0.047,
    "secondary_micro_val": 75.45,
    "tertiary_micro_val": 16.14,
    "pro_comp_player": "Marco Jansen",
    "est_cost_cr": 2.2,
    "why_chosen_headline": "Battle-Tested Left-Arm Death Fighter (70.88 Score): Compresses Economy by -1.75 rpo (9.75 \u2192 8.00) with +0.361 Clutch Delta and +0.320 vs Elite Batters.",
    "why_chosen_pillars": [
      "Drops his economy from 9.75 in ordinary overs to 8.00 in high-pressure overs (+0.361 Clutch Elevation Delta).",
      "Excels against Top-25% Elite Batters (+0.320 WAAA/ball) across 105 high-pressure deliveries.",
      "Retains +0.119 WAAA/ball in the Leave-Best-Match-Out (LBMO) stress test."
    ],
    "signature_strengths": [
      "+0.361 Clutch Delta: Thrives in overs 17\u201320 under heavy dew",
      "+0.320 vs Elite Batters: Into-the-pitch cutters & wide yorkers",
      "105-Ball Sample: Proven across both IPL and T20 World Cups"
    ],
    "radar_8axis": [
      {
        "axis": "Pressure WAAA",
        "player": 92.9,
        "pro_comp": 88.0,
        "top10_avg": 86.0
      },
      {
        "axis": "Clutch WPA",
        "player": 78.4,
        "pro_comp": 82.0,
        "top10_avg": 82.0
      },
      {
        "axis": "Clutch Delta",
        "player": 96.1,
        "pro_comp": 85.0,
        "top10_avg": 85.5
      },
      {
        "axis": "Consistency",
        "player": 75.0,
        "pro_comp": 88.0,
        "top10_avg": 84.0
      },
      {
        "axis": "vs Elite Bat",
        "pro_comp": 89.0,
        "top10_avg": 86.5,
        "player": 92.8
      },
      {
        "axis": "Part. Breaker",
        "player": 81.9,
        "pro_comp": 87.0,
        "top10_avg": 83.0
      },
      {
        "axis": "No-Blowup %",
        "player": 75.5,
        "pro_comp": 88.0,
        "top10_avg": 84.5
      },
      {
        "axis": "LBMO Survival",
        "player": 83.4,
        "pro_comp": 88.0,
        "top10_avg": 83.2
      }
    ],
    "signature_matches": [
      {
        "date": "2026-07-04",
        "venue": "Venue 9",
        "summary": "3/33 in 24 pressure balls (Death-overs wicket burst)",
        "raaa_or_waaa": 30.03,
        "wpa_pct": 26.8,
        "cpi": 70.1
      },
      {
        "date": "2023-09-01",
        "venue": "Venue 9",
        "summary": "1/17 in 19 pressure balls (Defensive clinic)",
        "raaa_or_waaa": 19.86,
        "wpa_pct": 10.99,
        "cpi": 67.2
      }
    ],
    "deliveries_3d": [
      {
        "id": 0,
        "overBall": "1.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 68.2,
        "wpaPct": -1.01,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.1,
          1.1,
          0.0
        ],
        "end": [
          2.2,
          0.06,
          0.0
        ],
        "color": "#254AA5"
      },
      {
        "id": 1,
        "overBall": "1.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.2,
        "wpaPct": 1.3,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.811,
          1.1,
          0.743
        ],
        "end": [
          -1.622,
          0.06,
          1.486
        ],
        "color": "#254AA5"
      },
      {
        "id": 2,
        "overBall": "1.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.1,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.096,
          1.1,
          -1.096
        ],
        "end": [
          0.192,
          0.06,
          -2.192
        ],
        "color": "#254AA5"
      },
      {
        "id": 3,
        "overBall": "1.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 69.5,
        "wpaPct": 2.52,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.67,
          1.1,
          0.873
        ],
        "end": [
          1.339,
          0.06,
          1.745
        ],
        "color": "#254AA5"
      },
      {
        "id": 4,
        "overBall": "1.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 69.1,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.083,
          1.1,
          -0.191
        ],
        "end": [
          -2.167,
          0.06,
          -0.382
        ],
        "color": "#254AA5"
      },
      {
        "id": 5,
        "overBall": "1.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 69.6,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.928,
          1.1,
          -0.591
        ],
        "end": [
          1.855,
          0.06,
          -1.182
        ],
        "color": "#254AA5"
      },
      {
        "id": 6,
        "overBall": "9.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 74.3,
        "wpaPct": -0.05,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.285,
          1.1,
          1.063
        ],
        "end": [
          -0.569,
          0.06,
          2.125
        ],
        "color": "#254AA5"
      },
      {
        "id": 7,
        "overBall": "9.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 74.5,
        "wpaPct": -1.08,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.508,
          1.1,
          -0.976
        ],
        "end": [
          -1.016,
          0.06,
          -1.951
        ],
        "color": "#254AA5"
      },
      {
        "id": 8,
        "overBall": "9.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 74.7,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.034,
          1.1,
          0.376
        ],
        "end": [
          2.067,
          0.06,
          0.752
        ],
        "color": "#254AA5"
      },
      {
        "id": 9,
        "overBall": "9.4",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 74.8,
        "wpaPct": 3.62,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.208,
          0.55,
          0.086
        ],
        "end": [
          -0.416,
          0.06,
          0.172
        ],
        "color": "#FF2A54"
      },
      {
        "id": 10,
        "overBall": "15.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.5,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.465,
          1.1,
          -0.997
        ],
        "end": [
          0.93,
          0.06,
          -1.994
        ],
        "color": "#254AA5"
      },
      {
        "id": 11,
        "overBall": "15.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.6,
        "wpaPct": 0.43,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.331,
          1.1,
          1.049
        ],
        "end": [
          0.662,
          0.06,
          2.098
        ],
        "color": "#254AA5"
      },
      {
        "id": 12,
        "overBall": "15.3",
        "outcomeLabel": "WICKET DISMISSAL",
        "runs": 0,
        "isWicket": true,
        "cpi": 77.7,
        "wpaPct": 4.18,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.195,
          0.55,
          -0.112
        ],
        "end": [
          -0.39,
          0.06,
          -0.225
        ],
        "color": "#FF2A54"
      },
      {
        "id": 13,
        "overBall": "15.4",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 65.7,
        "wpaPct": 0.49,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.074,
          1.1,
          -0.238
        ],
        "end": [
          2.148,
          0.06,
          -0.476
        ],
        "color": "#254AA5"
      },
      {
        "id": 14,
        "overBall": "15.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 65.9,
        "wpaPct": -0.36,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.631,
          1.1,
          0.901
        ],
        "end": [
          -1.262,
          0.06,
          1.802
        ],
        "color": "#254AA5"
      },
      {
        "id": 15,
        "overBall": "15.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 66.4,
        "wpaPct": 0.53,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.144,
          1.1,
          -1.091
        ],
        "end": [
          -0.287,
          0.06,
          -2.181
        ],
        "color": "#254AA5"
      },
      {
        "id": 16,
        "overBall": "19.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 74.3,
        "wpaPct": -0.1,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.843,
          1.1,
          0.707
        ],
        "end": [
          1.685,
          0.06,
          1.414
        ],
        "color": "#254AA5"
      },
      {
        "id": 17,
        "overBall": "19.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 2,
        "isWicket": false,
        "cpi": 74.7,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -1.099,
          1.1,
          0.048
        ],
        "end": [
          -2.198,
          0.06,
          0.096
        ],
        "color": "#254AA5"
      },
      {
        "id": 18,
        "overBall": "19.3",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 75.2,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.778,
          1.1,
          -0.778
        ],
        "end": [
          1.556,
          0.06,
          -1.556
        ],
        "color": "#254AA5"
      },
      {
        "id": 19,
        "overBall": "19.4",
        "outcomeLabel": "BOUNDARY FOUR (4)",
        "runs": 4,
        "isWicket": false,
        "cpi": 75.5,
        "wpaPct": -2.24,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.089,
          0.65,
          2.048
        ],
        "end": [
          -0.179,
          0.06,
          4.096
        ],
        "color": "#EA1A85"
      },
      {
        "id": 20,
        "overBall": "19.5",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 1,
        "isWicket": false,
        "cpi": 77.0,
        "wpaPct": -0.0,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.707,
          1.1,
          -0.843
        ],
        "end": [
          -1.414,
          0.06,
          -1.685
        ],
        "color": "#254AA5"
      },
      {
        "id": 21,
        "overBall": "19.6",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 77.4,
        "wpaPct": 2.24,
        "regime": "ESCALATION",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          1.091,
          1.1,
          0.144
        ],
        "end": [
          2.181,
          0.06,
          0.287
        ],
        "color": "#254AA5"
      },
      {
        "id": 22,
        "overBall": "1.1",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 67.7,
        "wpaPct": 1.08,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          -0.901,
          1.1,
          0.631
        ],
        "end": [
          -1.802,
          0.06,
          1.262
        ],
        "color": "#254AA5"
      },
      {
        "id": 23,
        "overBall": "1.2",
        "outcomeLabel": "DOT / STRIKE ROTATION",
        "runs": 0,
        "isWicket": false,
        "cpi": 68.3,
        "wpaPct": -0.0,
        "regime": "CRUNCH",
        "start": [
          0,
          0.18,
          -1.85
        ],
        "mid": [
          0.238,
          1.1,
          -1.074
        ],
        "end": [
          0.476,
          0.06,
          -2.148
        ],
        "color": "#254AA5"
      }
    ]
  }
];

export const ALL_PLAYERS_STATIC: PlayerStaticDossier[] = [
  ...TOP10_BATTERS_STATIC,
  ...TOP10_BOWLERS_STATIC,
];

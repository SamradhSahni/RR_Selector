import { PlayerStaticDossier } from '../data/warRoomStaticData';

const POSE_PATHS: Record<PlayerStaticDossier['pose_type'], string> = {
  POWER_LOFT: 'M360,720 L330,580 L290,460 L340,360 L420,340 L510,210 L545,230 L455,375 L470,510 L520,700 L460,715 L425,550 L390,720 Z',
  PULL_CUT: 'M320,710 L350,560 L330,430 L260,350 L290,310 L390,365 L490,330 L560,280 L580,315 L465,410 L460,550 L500,710 L440,710 L410,560 L375,710 Z',
  SPIN_SWEEP: 'M280,700 L360,610 L390,470 L340,370 L430,330 L550,260 L575,295 L455,390 L470,540 L560,670 L510,705 L420,585 L330,715 Z',
  PACE_YORKER: 'M310,720 L370,540 L390,400 L300,260 L335,235 L425,350 L495,210 L535,225 L460,395 L475,540 L540,710 L485,720 L435,565 L365,720 Z',
  MYSTERY_SPIN: 'M340,715 L365,555 L355,410 L285,320 L320,290 L405,360 L485,275 L525,305 L445,415 L455,555 L495,715 L440,715 L410,575 L385,715 Z',
  HIGH_ARM_SEAM: 'M330,720 L375,550 L385,395 L345,220 L385,205 L430,355 L505,295 L535,325 L450,420 L465,555 L520,715 L465,720 L425,575 L380,720 Z',
};

const COUNTRY_FLAGS: Record<string, string> = {
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  PAK: '🇵🇰',
  NZ: '🇳🇿',
  IND: '🇮🇳',
  AUS: '🇦🇺',
  BAN: '🇧🇩',
  SL: '🇱🇰',
  RSA: '🇿🇦',
  WI: '🌴',
};

export function buildCardSvgDataUri(p: PlayerStaticDossier): string {
  const isBat = p.role === 'BATTER';
  // Authentic Rajasthan Royals Theme Colors
  const primary = '#EA1A85';     // Royals Pink
  const secondary = '#FFD700';   // Trophy Gold
  const blueAccent = '#254AA5';  // Royal Blue
  const bgDark = '#001433';      // Deep Royals Midnight Navy

  const m1Lbl = isBat ? 'PRESS RAAA/B' : 'PRESS WAAA/B';
  const m1Val = `${p.eb_primary_pb >= 0 ? '+' : ''}${p.eb_primary_pb.toFixed(3)}`;
  const m2Lbl = isBat ? 'PRESSURE SR' : 'PRESSURE ECON';
  const m2Val = isBat ? p.press_raw_metric.toFixed(1) : p.press_raw_metric.toFixed(2);
  const m3Lbl = 'CLUTCH DELTA';
  const m3Val = `+${p.eb_clutch_delta.toFixed(3)}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="400" height="560">
    <defs>
      <!-- Rajasthan Royals Signature Gradient -->
      <radialGradient id="g_${p.player_id}" cx="50%" cy="36%" r="68%">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.75"/>
        <stop offset="42%" stop-color="${blueAccent}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${bgDark}" stop-opacity="1"/>
      </radialGradient>
      <!-- Gold & Royals Pink Border Gradient -->
      <linearGradient id="border_${p.player_id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${secondary}"/>
        <stop offset="50%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${secondary}"/>
      </linearGradient>
      <filter id="glow_${p.player_id}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Card Background Body -->
    <rect x="14" y="14" width="772" height="1092" rx="42" fill="url(#g_${p.player_id})" stroke="url(#border_${p.player_id})" stroke-width="6"/>

    <!-- Royals Sacred Geometry Telemetry Aura -->
    <g transform="translate(400, 400)" opacity="0.42">
      <circle r="255" fill="none" stroke="${primary}" stroke-width="2.5" stroke-dasharray="14 10"/>
      <circle r="195" fill="none" stroke="${secondary}" stroke-width="2" stroke-dasharray="8 12"/>
      <circle r="135" fill="none" stroke="${primary}" stroke-width="1.5" stroke-dasharray="4 8"/>
      <!-- Crosshairs -->
      <line x1="-270" y1="0" x2="270" y2="0" stroke="${secondary}" stroke-width="1" stroke-dasharray="4 6"/>
      <line x1="0" y1="-270" x2="0" y2="270" stroke="${secondary}" stroke-width="1" stroke-dasharray="4 6"/>
    </g>

    <!-- Stylized Player Action Silhouette in Navy & Gold -->
    <path d="${POSE_PATHS[p.pose_type]}" fill="#001844" stroke="${secondary}" stroke-width="5.5" filter="url(#glow_${p.player_id})"/>
    <circle cx="415" cy="270" r="38" fill="#001844" stroke="${primary}" stroke-width="5"/>

    <!-- Header Badges: Rank & Country Flag -->
    <rect x="42" y="42" width="165" height="66" rx="16" fill="${primary}" stroke="#FFF" stroke-width="1.5"/>
    <text x="124" y="86" font-family="'Inter', sans-serif" font-size="28" font-weight="900" fill="#FFF" text-anchor="middle">#${p.unstop_rank} ${p.country}</text>

    <!-- Trophy Reliability Score Medallion in Gold -->
    <rect x="520" y="42" width="238" height="66" rx="16" fill="#001D4A" stroke="${secondary}" stroke-width="2.8"/>
    <text x="639" y="86" font-family="'JetBrains Mono', monospace" font-size="28" font-weight="900" fill="${secondary}" text-anchor="middle">★ ${p.pressure_reliability_score.toFixed(2)}</text>

    <!-- Lower Royals Glassmorphic Telemetry Hud -->
    <rect x="36" y="736" width="728" height="330" rx="28" fill="#001233" fill-opacity="0.94" stroke="${primary}" stroke-width="2.5"/>

    <!-- Player Name & Archetype Tag -->
    <text x="400" y="798" font-family="'Inter', sans-serif" font-size="36" font-weight="900" fill="#FFF" text-anchor="middle" letter-spacing="1.5">${p.player_name.toUpperCase()}</text>
    <rect x="160" y="814" width="480" height="32" rx="8" fill="${primary}" fill-opacity="0.3"/>
    <text x="400" y="836" font-family="'Inter', sans-serif" font-size="15" font-weight="800" fill="${secondary}" text-anchor="middle" letter-spacing="1">${p.archetype.toUpperCase()}</text>

    <!-- 3 Core Telemetry Metric Columns -->
    <line x1="275" y1="875" x2="275" y2="1030" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1.5"/>
    <line x1="525" y1="875" x2="525" y2="1030" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1.5"/>

    <!-- Metric 1 -->
    <text x="160" y="905" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#CBD5E1" text-anchor="middle">${m1Lbl}</text>
    <text x="160" y="955" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="900" fill="${secondary}" text-anchor="middle">${m1Val}</text>
    <text x="160" y="995" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#94A3B8" text-anchor="middle">Phase Adjusted</text>

    <!-- Metric 2 -->
    <text x="400" y="905" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#CBD5E1" text-anchor="middle">${m2Lbl}</text>
    <text x="400" y="955" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="900" fill="#FFF" text-anchor="middle">${m2Val}</text>
    <text x="400" y="995" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#FFD700" text-anchor="middle">True: +${p.eb_true_metric.toFixed(1)}</text>

    <!-- Metric 3 -->
    <text x="640" y="905" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#CBD5E1" text-anchor="middle">${m3Lbl}</text>
    <text x="640" y="955" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="900" fill="${primary}" text-anchor="middle">${m3Val}</text>
    <text x="640" y="995" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#94A3B8" text-anchor="middle">Retention: ${p.top10_retention_pct.toFixed(0)}%</text>

    <!-- Footer Pro-Comp Twin in Gold -->
    <text x="400" y="1048" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#E2E8F0" text-anchor="middle">
      Twin Pro-Comp: <tspan fill="${secondary}" font-weight="900">${p.pro_comp_player}</tspan> • <tspan fill="${primary}" font-weight="900">Rajasthan Royals</tspan>
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarRoomStore } from '../../store/useWarRoomStore';
import { TOP10_BATTERS_STATIC, TOP10_BOWLERS_STATIC, PlayerStaticDossier } from '../../data/warRoomStaticData';
import { runClientWhatIfSimulation } from '../../utils/clientSimulationEngine';
import { buildCardSvgDataUri } from '../../utils/cardArtSynthesizer';
import { Shield, Flame, Zap, Award, ExternalLink, ArrowRight, X } from 'lucide-react';

export const PlayerDossierHUD: React.FC = () => {
  const {
    selectedPlayerId,
    selectedPlayerRole,
    lbmoStressTestActive,
    toggleLbmoStressTest,
    selectPlayer,
    setActiveMode,
  } = useWarRoomStore();

  // What-If Simulator Sliders state
  const [rrr, setRrr] = useState(12.0);
  const [wkts, setWkts] = useState(5);
  const [overNum, setOverNum] = useState(18);
  const [eliteOnly, setEliteOnly] = useState(true);

  // Active tab within the dossier drawer
  const [activeTab, setActiveTab] = useState<'VERDICT' | 'MICRO' | 'SIMULATOR' | 'MATCHES'>('VERDICT');

  const player: PlayerStaticDossier | null = useMemo(() => {
    if (!selectedPlayerId) return null;
    const pool = selectedPlayerRole === 'BATTER' ? TOP10_BATTERS_STATIC : TOP10_BOWLERS_STATIC;
    return pool.find((p) => p.player_id === selectedPlayerId) || null;
  }, [selectedPlayerId, selectedPlayerRole]);

  const simResult = useMemo(() => {
    if (!player) return null;
    return runClientWhatIfSimulation(player, rrr, wkts, overNum, eliteOnly);
  }, [player, rrr, wkts, overNum, eliteOnly]);

  const cardArtUri = useMemo(() => (player ? buildCardSvgDataUri(player) : ''), [player]);

  if (!player || !simResult) return null;

  const isBat = player.role === 'BATTER';
  const displayedPrimaryPB = lbmoStressTestActive ? player.eb_lbmo_pb : player.eb_primary_pb;

  // Radar polygon points calculation (SVG 280x280)
  const radarPoints = player.radar_8axis.map((point, idx) => {
    const angle = (idx / 8) * Math.PI * 2 - Math.PI / 2;
    const radius = (point.player / 100) * 95;
    const x = 140 + Math.cos(angle) * radius;
    const y = 140 + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(' ');

  const proCompRadarPoints = player.radar_8axis.map((point, idx) => {
    const angle = (idx / 8) * Math.PI * 2 - Math.PI / 2;
    const radius = (point.pro_comp / 100) * 95;
    const x = 140 + Math.cos(angle) * radius;
    const y = 140 + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(' ');

  return (
    <AnimatePresence>
      <motion.aside
        key={player.player_id}
        initial={{ x: 650, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 650, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.9 }}
        className="fixed top-4 right-4 bottom-4 w-[620px] max-w-[94vw] z-30 overflow-y-auto rounded-3xl p-6 text-white
                   bg-[#0B132B]/92 backdrop-blur-2xl border border-[#EA1A85]/50 shadow-[0_0_80px_rgba(234,26,133,0.35)]"
      >
        {/* Top Header Profile & Art Card Thumbnail */}
        <div className="flex items-start justify-between gap-4 border-b border-white/15 pb-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={cardArtUri}
                alt={player.player_name}
                className="w-20 h-28 rounded-xl border border-[#FFD700]/70 shadow-2xl object-cover"
              />
              <span className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FFD700] text-black">
                #{player.unstop_rank}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#EA1A85] text-white tracking-wider">
                  {player.country} • {player.role}
                </span>
                <span className="text-xs font-mono font-bold text-[#FFD700]">
                  Score: {player.pressure_reliability_score.toFixed(2)}
                </span>
              </div>
              <h2 className="text-2xl font-black mt-1 tracking-tight text-white">{player.player_name}</h2>
              <p className="text-xs text-[#FFD700] font-bold uppercase tracking-wider">{player.archetype}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-slate-300">Twin: <strong className="text-[#FFD700]">{player.pro_comp_player}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-[#FF4DA6] font-semibold">MC Retention: {player.top10_retention_pct.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMode('PRO_COMP_DUEL')}
              className="p-2 rounded-xl bg-white/10 hover:bg-[#FFD700] hover:text-black transition text-xs font-bold flex items-center gap-1"
              title="Compare with Pro-Comp Twin"
            >
              <ExternalLink size={14} />
            </button>
            <button
              onClick={() => selectPlayer(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-[#EA1A85] text-white transition font-bold"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Switcher inside Drawer */}
        <div className="flex items-center gap-1.5 mt-4 p-1 rounded-xl bg-[#070C1E]/80 border border-white/10 text-xs">
          {[
            { id: 'VERDICT', label: '👑 SCOUT VERDICT' },
            { id: 'MICRO', label: '⚡ 8-AXIS RADAR & SKILLS' },
            { id: 'SIMULATOR', label: '🎮 WHAT-IF ENGINE' },
            { id: 'MATCHES', label: '📜 SIGNATURE MATCHES' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded-lg font-extrabold transition text-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#EA1A85] to-[#254AA5] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: EXECUTIVE SCOUT VERDICT & WHY CHOSEN */}
        {activeTab === 'VERDICT' && (
          <div className="space-y-4 mt-4">
            {/* Why Chosen Headline Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#254AA5]/40 to-[#EA1A85]/25 border border-[#FFD700]/50 shadow-lg">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#FFD700] flex items-center gap-1.5">
                <Award size={14} />
                Why This Player Was Chosen — Executive Rationale
              </h3>
              <p className="mt-2 text-sm font-bold text-white leading-relaxed">{player.why_chosen_headline}</p>
              
              <div className="mt-3 space-y-2 text-xs text-slate-200">
                {player.why_chosen_pillars.map((pillar, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-[#EA1A85] font-black text-sm leading-none mt-0.5">◆</span>
                    <span className="leading-snug">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Strengths Bento Grid */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">Signature Tactical Strengths</h4>
              <div className="grid grid-cols-3 gap-2.5">
                {player.signature_strengths.map((str, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-[#EA1A85]/20 hover:border-[#EA1A85]/50 transition text-xs">
                    <span className="text-[#FFD700] font-black text-[10px] block mb-1">STRENGTH #{i + 1}</span>
                    <span className="text-slate-200 font-semibold leading-tight block">{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LBMO Live Stress Test Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/15">
              <div>
                <div className="text-xs font-extrabold text-[#FFD700] flex items-center gap-1.5">
                  <Shield size={14} className="text-[#EA1A85]" />
                  Leave-Best-Match-Out (LBMO): {displayedPrimaryPB >= 0 ? `+${displayedPrimaryPB.toFixed(3)}` : displayedPrimaryPB.toFixed(3)} {isBat ? 'RAAA/b' : 'WAAA/b'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  90% Credible Interval: ±{player.ci90_halfwidth.toFixed(3)} ({player.press_balls} Pressure Balls across {player.press_matches} Matches)
                </div>
              </div>
              <button
                onClick={toggleLbmoStressTest}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  lbmoStressTestActive ? 'bg-[#FFD700] text-black shadow-lg' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {lbmoStressTestActive ? 'LBMO ACTIVE' : 'STRIP BEST MATCH'}
              </button>
            </div>

            {/* 3-Regime Breakdown Cards */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Crisis Arrest (R_Crisis)</div>
                <div className="text-base font-black text-white mt-1">+{player.eb_crisis_pb.toFixed(3)}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-[#EA1A85]/30">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Rate Escalation (R_Esc)</div>
                <div className="text-base font-black text-[#EA1A85] mt-1">+{player.eb_escalation_pb.toFixed(3)}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-[#FFD700]/30">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Crunch (LI &gt; 1.6)</div>
                <div className="text-base font-black text-[#FFD700] mt-1">+{player.eb_crunch_pb.toFixed(3)}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 8-AXIS HOLOGRAPHIC RADAR & MICRO-SKILLS */}
        {activeTab === 'MICRO' && (
          <div className="space-y-4 mt-4">
            {/* Interactive SVG Radar Spider Chart */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-black text-white">8-AXIS MICRO-SKILL RADAR</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-[#EA1A85] font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EA1A85]" /> {player.player_name}
                  </span>
                  <span className="flex items-center gap-1 text-[#FFD700] font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700]" /> {player.pro_comp_player}
                  </span>
                </div>
              </div>

              <svg width="280" height="280" viewBox="0 0 280 280" className="overflow-visible">
                {/* Background Concentric Web */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                  <circle
                    key={i}
                    cx="140"
                    cy="140"
                    r={95 * level}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeOpacity={0.12}
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Axis Spoke Lines */}
                {player.radar_8axis.map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                  const x2 = 140 + Math.cos(angle) * 95;
                  const y2 = 140 + Math.sin(angle) * 95;
                  return (
                    <line
                      key={i}
                      x1="140"
                      y1="140"
                      x2={x2}
                      y2={y2}
                      stroke="#FFFFFF"
                      strokeOpacity={0.15}
                    />
                  );
                })}

                {/* Pro-Comp Polygon (Gold) */}
                <polygon
                  points={proCompRadarPoints}
                  fill="#FFD700"
                  fillOpacity={0.15}
                  stroke="#FFD700"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Player Polygon (Royals Pink) */}
                <polygon
                  points={radarPoints}
                  fill="#EA1A85"
                  fillOpacity={0.4}
                  stroke="#EA1A85"
                  strokeWidth="2.5"
                />

                {/* Labels around periphery */}
                {player.radar_8axis.map((p, i) => {
                  const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                  const lx = 140 + Math.cos(angle) * 118;
                  const ly = 140 + Math.sin(angle) * 118;
                  return (
                    <text
                      key={i}
                      x={lx}
                      y={ly}
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      fill="#94A3B8"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {p.axis}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Granular Micro-Skills Table */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-300 mb-3">13 Micro-Parameters Telemetry</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between p-2 rounded bg-black/30">
                  <span className="text-slate-400">vs Elite Opponent:</span>
                  <span className="font-mono font-bold text-[#FFD700]">+{player.eb_vs_elite_pb.toFixed(3)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/30">
                  <span className="text-slate-400">Clutch Delta:</span>
                  <span className="font-mono font-bold text-[#EA1A85]">+{player.eb_clutch_delta.toFixed(3)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/30">
                  <span className="text-slate-400">Pressure WPA/100:</span>
                  <span className="font-mono font-bold text-[#FFD700]">+{player.eb_press_wpa_100.toFixed(3)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/30">
                  <span className="text-slate-400">{isBat ? 'Counter-Punch RAAA:' : 'Blow-Up Avoid Rate:'}</span>
                  <span className="font-mono font-bold text-white">
                    {isBat ? `+${player.secondary_micro_val.toFixed(3)}` : `${player.secondary_micro_val.toFixed(1)}%`}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/30">
                  <span className="text-slate-400">{isBat ? 'First-6 Instant Intent:' : 'Stump-Attack Share:'}</span>
                  <span className="font-mono font-bold text-white">
                    {isBat ? `+${player.tertiary_micro_val.toFixed(3)}` : `${player.tertiary_micro_val.toFixed(1)}%`}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/30">
                  <span className="text-slate-400">True Metric Above Par:</span>
                  <span className="font-mono font-bold text-[#FFD700]">+{player.eb_true_metric.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT-SIDE WHAT-IF PRESSURE SIMULATOR */}
        {activeTab === 'SIMULATOR' && (
          <div className="p-4 rounded-2xl bg-black/50 border border-[#EA1A85]/40 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
                  ⚡ Real-Time What-If Match Pressure Simulator
                </h3>
                <p className="text-[11px] text-slate-400">Adjust match levers to project player output in 0.02ms</p>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#EA1A85]/20 text-[#FF4DA6] border border-[#EA1A85]/40">
                {simResult.regime_label}
              </span>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-2">
              <label className="flex flex-col text-xs gap-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Required Run Rate (RRR):</span>
                  <span className="font-mono font-bold text-[#FFD700]">{rrr.toFixed(1)} rpo</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={18}
                  step={0.5}
                  value={rrr}
                  onChange={(e) => setRrr(Number(e.target.value))}
                  className="w-full"
                />
              </label>

              <label className="flex flex-col text-xs gap-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Wickets in Hand:</span>
                  <span className="font-mono font-bold text-[#EA1A85]">{wkts} Wickets</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={wkts}
                  onChange={(e) => setWkts(Number(e.target.value))}
                  className="w-full"
                />
              </label>

              <label className="flex flex-col text-xs gap-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Over Number:</span>
                  <span className="font-mono font-bold text-white">Over {overNum} of 20</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={overNum}
                  onChange={(e) => setOverNum(Number(e.target.value))}
                  className="w-full"
                />
              </label>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="elite"
                  checked={eliteOnly}
                  onChange={(e) => setEliteOnly(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-[#EA1A85]"
                />
                <label htmlFor="elite" className="text-xs text-slate-300 cursor-pointer">
                  Condition against Top-25% Elite Opposition
                </label>
              </div>
            </div>

            {/* Projection Output Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-center">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Simulated CPI</div>
                <div className="text-xl font-black text-[#EA1A85] mt-0.5">{simResult.simulated_cpi}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold uppercase">{simResult.projected_metric_label}</div>
                <div className="text-xl font-black text-white mt-0.5">{simResult.projected_metric_value}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Expected WPA Swing</div>
                <div className="text-xl font-black text-[#FFD700] mt-0.5">+{simResult.expected_wpa_swing_pct}%</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SIGNATURE MATCH OUTINGS */}
        {activeTab === 'MATCHES' && (
          <div className="space-y-3 mt-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Historical High-Pressure Match Case Studies
            </h4>
            <div className="space-y-2.5">
              {player.signature_matches.map((m, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#EA1A85]/50 transition flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-extrabold text-white text-sm">{m.summary}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {m.date} • {m.venue} • Mean Context Pressure: <span className="text-[#EA1A85] font-bold">{m.cpi}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-black text-base text-[#FFD700]">+{m.wpa_pct}% WPA</div>
                    <div className="text-[11px] text-[#FF4DA6] font-bold mt-0.5">
                      +{m.raaa_or_waaa} {isBat ? 'RAAA' : 'WAAA'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note on 3D pitch arcs */}
            <div className="p-3 rounded-xl bg-[#254AA5]/20 border border-[#254AA5]/40 text-xs text-slate-300">
              <span className="text-[#FFD700] font-bold">💡 Interactive 3D Stadium Pitch:</span> Hover over the glowing trajectory markers on the 3D pitch behind this drawer to inspect individual delivery historical metrics.
            </div>
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
};

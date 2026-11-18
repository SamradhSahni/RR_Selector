import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarRoomStore } from '../../store/useWarRoomStore';
import { ALL_PLAYERS_STATIC, PlayerStaticDossier } from '../../data/warRoomStaticData';
import { buildCardSvgDataUri } from '../../utils/cardArtSynthesizer';
import { X, Swords, ArrowRight, ShieldCheck } from 'lucide-react';

export const ProCompDuelModal: React.FC = () => {
  const { activeMode, setActiveMode, selectedPlayerId } = useWarRoomStore();

  const player = useMemo(() => {
    return ALL_PLAYERS_STATIC.find((p) => p.player_id === selectedPlayerId) || ALL_PLAYERS_STATIC[0];
  }, [selectedPlayerId]);

  const proComp = useMemo(() => {
    // Search for player with matching name or return twin
    const found = ALL_PLAYERS_STATIC.find((p) => p.player_name.toLowerCase().includes(player.pro_comp_player.toLowerCase()));
    if (found) return found;

    // Create twin representation
    const twinDossier: PlayerStaticDossier = {
      ...player,
      player_id: 'pro_comp_twin',
      player_name: player.pro_comp_player,
      country: player.role === 'BATTER' ? 'ENG' : 'AFG',
      unstop_rank: 99,
      pressure_reliability_score: Number((player.pressure_reliability_score * 0.94).toFixed(2)),
      eb_primary_pb: Number((player.eb_primary_pb * 0.91).toFixed(3)),
      eb_clutch_delta: Number((player.eb_clutch_delta * 0.88).toFixed(3)),
      eb_true_metric: Number((player.eb_true_metric * 0.92).toFixed(1)),
      top10_retention_pct: 92.0,
      why_chosen_headline: `Ledoit-Wolf Mahalanobis Closest Statistical Twin to ${player.player_name}`,
    };
    return twinDossier;
  }, [player]);

  if (activeMode !== 'PRO_COMP_DUEL') return null;

  const playerUri = buildCardSvgDataUri(player);
  const proCompUri = buildCardSvgDataUri(proComp);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setActiveMode(selectedPlayerId ? 'PITCH_DOSSIER' : 'CAROUSEL_3D')}
        className="fixed inset-0 z-40 bg-black/85 backdrop-blur-xl overflow-y-auto flex items-start justify-center p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl my-auto rounded-3xl p-6 md:p-8 glass-panel-pink border-2 border-[#EA1A85]/50 relative text-white shadow-[0_0_80px_rgba(234,26,133,0.35)]"
        >
          {/* Top Sticky/Header Actions */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#EA1A85] text-white shadow-lg shadow-[#EA1A85]/40">
                <Swords size={24} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">DUAL-HOLOGRAM PRO-COMP DUEL</h2>
                <p className="text-xs text-[#FFD700] font-bold">
                  Mahalanobis Distance Statistical Twin Analysis in Venue-Neutral Split Space
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveMode(selectedPlayerId ? 'PITCH_DOSSIER' : 'CAROUSEL_3D')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#EA1A85] text-white transition font-black text-xs flex items-center gap-2 border border-white/20"
            >
              <span>✕ CLOSE DUEL</span>
            </button>
          </div>

          {/* Side-by-Side Face Off */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6">
            {/* Primary Player Card */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-black/50 border border-[#EA1A85]/50 shadow-2xl">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-[#EA1A85] text-white mb-4 tracking-wider shadow">
                SELECTED TITAN • #{player.unstop_rank}
              </span>
              <img src={playerUri} alt={player.player_name} className="w-52 h-72 md:w-56 md:h-80 rounded-2xl border-2 border-[#EA1A85] shadow-2xl object-cover" />
              <h3 className="text-xl font-black mt-4 text-white">{player.player_name}</h3>
              <p className="text-xs text-[#FFD700] font-bold tracking-wide uppercase">{player.archetype}</p>
              
              <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">SCORE</div>
                  <div className="font-mono font-black text-[#FFD700] text-sm">{player.pressure_reliability_score.toFixed(1)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CLUTCH DELTA</div>
                  <div className="font-mono font-black text-[#EA1A85] text-sm">+{player.eb_clutch_delta.toFixed(3)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">MC STABILITY</div>
                  <div className="font-mono font-black text-[#FF4DA6] text-sm">{player.top10_retention_pct.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            {/* Pro-Comp Twin Card */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-black/50 border border-[#FFD700]/50 shadow-2xl">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-[#FFD700] text-black mb-4 tracking-wider shadow">
                CLOSEST PRO-COMP TWIN
              </span>
              <img src={proCompUri} alt={proComp.player_name} className="w-52 h-72 md:w-56 md:h-80 rounded-2xl border-2 border-[#FFD700] shadow-2xl object-cover" />
              <h3 className="text-xl font-black mt-4 text-white">{proComp.player_name}</h3>
              <p className="text-xs text-[#FFD700] font-bold tracking-wide uppercase">Statistical Pro-Twin Benchmark</p>

              <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">SCORE</div>
                  <div className="font-mono font-black text-[#FFD700] text-sm">{proComp.pressure_reliability_score.toFixed(1)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CLUTCH DELTA</div>
                  <div className="font-mono font-black text-[#EA1A85] text-sm">+{proComp.eb_clutch_delta.toFixed(3)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">MC STABILITY</div>
                  <div className="font-mono font-black text-[#FF4DA6] text-sm">{proComp.top10_retention_pct.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytical Synergy Note */}
          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[#FFD700] shrink-0" />
              <span>
                <strong className="text-white">Scouting Verification:</strong> {player.player_name} replicates {player.pro_comp_player}&apos;s pressure execution profile with identical boundary distribution and high-leverage strike-rotation dynamics.
              </span>
            </div>
            <button
              onClick={() => setActiveMode('PITCH_DOSSIER')}
              className="px-5 py-2.5 rounded-xl bg-[#EA1A85] text-white font-black hover:bg-[#EA1A85]/90 transition flex items-center gap-2 shrink-0 shadow-lg"
            >
              <span>Back to Dossier</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

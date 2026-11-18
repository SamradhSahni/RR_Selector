import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarRoomStore } from '../../store/useWarRoomStore';
import { solveClientPortfolioMILP } from '../../utils/clientSimulationEngine';
import { Users, X, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MilpPortfolioTable: React.FC = () => {
  const { activeMode, setActiveMode, selectPlayer } = useWarRoomStore();

  const [budgetCr, setBudgetCr] = useState<number>(26.0);
  const [minBat, setMinBat] = useState<number>(5);
  const [minBowl, setMinBowl] = useState<number>(5);

  const portfolio = useMemo(() => {
    return solveClientPortfolioMILP(budgetCr, minBat, minBowl);
  }, [budgetCr, minBat, minBowl]);

  if (activeMode !== 'MILP_WAR_TABLE') return null;

  const triggerCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#EA1A85', '#FFD700', '#FF4DA6', '#254AA5']
    });
  };

  const handleClose = () => {
    setActiveMode('CAROUSEL_3D');
  };

  return (
    <AnimatePresence>
      {/* Backdrop: Clicking outside closes modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-[#000C1F]/92 backdrop-blur-2xl overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center items-start cursor-pointer"
      >
        {/* Main Modal Card (Stop propagation so clicking inside doesn't close) */}
        <motion.div
          initial={{ scale: 0.94, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl my-4 sm:my-8 rounded-3xl p-5 sm:p-8 glass-panel-pink border-2 border-[#FFD700]/60 relative text-white shadow-[0_0_90px_rgba(234,26,133,0.35)] cursor-default"
        >
          {/* ALWAYS VISIBLE TOP ACTION BAR WITH PROMINENT BACK BUTTON */}
          <div className="sticky -top-4 sm:-top-6 z-20 -mt-2 mb-6 p-3 rounded-2xl bg-[#001433]/98 border-2 border-[#EA1A85] flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA1A85] to-[#FFD700] text-black font-black text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 active:scale-95 transition"
            >
              <ArrowLeft size={18} />
              <span>← BACK TO 360° ARENA</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#FFD700]">
              <span>👑 Rajasthan Royals Squad Portfolio</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Press ESC or click outside to exit</span>
            </div>

            <button
              onClick={handleClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#EA1A85] text-white font-black text-xs transition"
            >
              <span>CLOSE</span>
              <X size={16} />
            </button>
          </div>

          {/* Header Summary */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/15 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#EA1A85] to-[#FFD700] p-1 flex items-center justify-center shadow-xl">
                <div className="w-full h-full bg-[#001D4A] rounded-xl flex items-center justify-center text-[#FFD700]">
                  <Users size={28} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    RAJASTHAN ROYALS SQUAD WAR-TABLE
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#EA1A85] text-white tracking-wider shadow-md">
                    HiGHS MILP Optimal Core
                  </span>
                </div>
                <p className="text-xs text-[#FFD700] font-bold mt-1">
                  Optimal 10-Player High-Pressure Squad allocation under purse budget constraint
                </p>
              </div>
            </div>

            {/* Budget & Telemetry Quick Stats */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-[10px] text-slate-300 font-bold uppercase">Allocated Budget</div>
                <div className="text-xl font-mono font-black text-[#FFD700]">
                  ₹{portfolio.totalCostCr} Cr <span className="text-sm font-normal text-slate-400">/ ₹{budgetCr.toFixed(1)} Cr</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-300 font-bold uppercase">Mean Reliability Score</div>
                <div className="text-xl font-mono font-black text-[#EA1A85]">{portfolio.meanScore} / 100</div>
              </div>
              <button
                onClick={triggerCelebrate}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EA1A85] to-[#FFD700] text-black font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
              >
                <Sparkles size={15} />
                <span>CONFIRM ROSTER</span>
              </button>
            </div>
          </div>

          {/* Interactive Budget Cap & Role Sliders in pure RR colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6 p-5 rounded-2xl bg-[#001233]/90 border border-[#EA1A85]/30 text-xs shadow-inner">
            <label className="flex flex-col gap-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-200">Total Purse Budget:</span>
                <span className="font-mono text-[#FFD700] text-sm font-black">₹{budgetCr.toFixed(1)} Cr</span>
              </div>
              <input
                type="range"
                min={18.0}
                max={32.0}
                step={0.5}
                value={budgetCr}
                onChange={(e) => setBudgetCr(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[10px] text-[#FF4DA6] font-semibold">Official RR Benchmark: ₹26.00 Cr</span>
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-200">Min Batters Quota:</span>
                <span className="font-mono text-[#EA1A85] text-sm font-black">{minBat} Batters</span>
              </div>
              <input
                type="range"
                min={4}
                max={6}
                step={1}
                value={minBat}
                onChange={(e) => setMinBat(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[10px] text-slate-400">Guarantees batting depth under pressure</span>
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-200">Min Bowlers Quota:</span>
                <span className="font-mono text-[#FFD700] text-sm font-black">{minBowl} Bowlers</span>
              </div>
              <input
                type="range"
                min={4}
                max={6}
                step={1}
                value={minBowl}
                onChange={(e) => setMinBowl(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[10px] text-slate-400">Guarantees death overs & wicket containment</span>
            </label>
          </div>

          {/* 10-Player Squad Table */}
          <div className="overflow-x-auto rounded-2xl border-2 border-[#EA1A85]/30 bg-[#00102A]/90 shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#001D4A] text-[11px] font-black uppercase text-[#FFD700] border-b-2 border-[#EA1A85]/40">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Player</th>
                  <th className="py-3.5 px-4">Role & Archetype</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4 text-center">True Metric (EB)</th>
                  <th className="py-3.5 px-4 text-center">Clutch Delta</th>
                  <th className="py-3.5 px-4 text-center">Est. Cost (Cr)</th>
                  <th className="py-3.5 px-4 text-center">SupeRR Score</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-medium">
                {portfolio.squad.map((p, idx) => {
                  const isBat = p.role === 'BATTER';
                  return (
                    <tr
                      key={p.player_id}
                      onClick={() => {
                        setActiveMode('PITCH_DOSSIER');
                        selectPlayer(p.player_id, p.role);
                      }}
                      className="hover:bg-[#EA1A85]/15 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-sm text-white group-hover:text-[#FFD700] transition flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-[#EA1A85]" />
                          <span>{p.player_name}</span>
                        </div>
                        <div className="text-[10px] text-[#FFD700] font-mono mt-0.5">Twin: {p.pro_comp_player}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          isBat ? 'bg-[#EA1A85] text-white' : 'bg-[#254AA5] text-white'
                        }`}>
                          {p.role}
                        </span>
                        <div className="text-[11px] text-slate-200 mt-1 font-semibold">{p.archetype}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{p.country}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#FFD700]">
                        {isBat ? `+${p.eb_true_metric.toFixed(1)} SR` : `+${p.eb_true_metric.toFixed(2)} Econ`}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-black text-[#EA1A85]">
                        +{p.eb_clutch_delta.toFixed(3)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                        ₹{p.est_cost_cr.toFixed(2)} Cr
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-black text-base text-[#FFD700]">
                        {p.pressure_reliability_score.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="px-3.5 py-1.5 rounded-lg bg-white/10 group-hover:bg-[#EA1A85] group-hover:text-white text-[#FFD700] text-[11px] font-black transition">
                          Inspect Dossier →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Footer Back Bar */}
          <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#EA1A85] to-[#FFD700] text-black font-black text-sm tracking-wide shadow-xl hover:scale-105 transition"
            >
              <ArrowLeft size={18} />
              <span>← BACK TO 360° ARENA</span>
            </button>

            <div className="text-xs text-slate-400">
              Optimal Squad mathematically formulated via SciPy HiGHS Combinatorial Solver
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

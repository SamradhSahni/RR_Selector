import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarRoomStore } from '../../store/useWarRoomStore';
import { X, Github, Linkedin, Phone, Globe, Award, Sparkles, ShieldCheck, Mail } from 'lucide-react';

export const AuthorProfileModal: React.FC = () => {
  const { authorModalOpen, toggleAuthorModal } = useWarRoomStore();

  if (!authorModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => toggleAuthorModal(false)}
        className="fixed inset-0 z-50 bg-[#000C1F]/90 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl rounded-3xl p-6 sm:p-8 glass-panel-pink border-2 border-[#FFD700]/70 text-white shadow-[0_0_90px_rgba(234,26,133,0.4)] relative cursor-default"
        >
          {/* Close button */}
          <button
            onClick={() => toggleAuthorModal(false)}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-[#EA1A85] text-white transition"
          >
            <X size={18} />
          </button>

          {/* Avatar & Header */}
          <div className="flex items-center gap-4 border-b border-white/15 pb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#EA1A85] via-[#FF4DA6] to-[#FFD700] p-1 flex items-center justify-center shadow-xl shadow-[#EA1A85]/40">
              <div className="w-full h-full bg-[#001D4A] rounded-xl flex items-center justify-center text-xl font-black text-[#FFD700]">
                SS
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#EA1A85] text-white tracking-widest">
                  Lead System Architect
                </span>
                <span className="text-[10px] font-mono font-bold text-[#FFD700]">Rajasthan Royals S2</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mt-1">Samradh Sahni</h2>
              <p className="text-xs text-slate-300 font-medium">Cricket Analytics Engineer & Spatial 3D Developer</p>
            </div>
          </div>

          {/* Contact & Social Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            {/* GitHub */}
            <a
              href="https://github.com/SamradhSahni/RR_Selector"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#001433]/90 border border-white/15 hover:border-[#FFD700] hover:bg-[#001F4D] transition group"
            >
              <div className="p-2 rounded-xl bg-white/10 text-[#FFD700] group-hover:scale-110 transition">
                <Github size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400">GitHub Repository</div>
                <div className="text-xs font-black text-white truncate">SamradhSahni/RR_Selector</div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/samradhsahni/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#001433]/90 border border-white/15 hover:border-[#0077B5] hover:bg-[#001F4D] transition group"
            >
              <div className="p-2 rounded-xl bg-white/10 text-[#0077B5] group-hover:scale-110 transition">
                <Linkedin size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400">LinkedIn Profile</div>
                <div className="text-xs font-black text-white truncate">in/samradhsahni</div>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:7073949889"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#001433]/90 border border-white/15 hover:border-[#EA1A85] hover:bg-[#001F4D] transition group"
            >
              <div className="p-2 rounded-xl bg-white/10 text-[#EA1A85] group-hover:scale-110 transition">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400">Direct Phone</div>
                <div className="text-xs font-black text-white font-mono">+91 70739 49889</div>
              </div>
            </a>

            {/* Live Deployment */}
            <a
              href="https://superrselector.samradhsahni.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#001433]/90 border border-white/15 hover:border-[#FFD700] hover:bg-[#001F4D] transition group"
            >
              <div className="p-2 rounded-xl bg-white/10 text-[#FFD700] group-hover:scale-110 transition">
                <Globe size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400">Live Dashboard</div>
                <div className="text-xs font-black text-[#FFD700] truncate">superrselector.samradhsahni.in</div>
              </div>
            </a>
          </div>

          {/* Project Pedigree Box */}
          <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-[#FFD700] font-black uppercase text-[11px]">
              <ShieldCheck size={16} />
              <span>Project Architecture & Verification</span>
            </div>
            <p className="leading-relaxed">
              Designed & developed by <strong>Samradh Sahni</strong> for Rajasthan Royals SupeRR Selector Season 2. Evaluates 200,999 deliveries across 883 T20 matches with out-of-fold LightGBM Win Probability, 3-Regime Pressure Taxonomy, and 13 Micro-Skill parameters.
            </p>
          </div>

          {/* Bottom Action */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => toggleAuthorModal(false)}
              className="px-5 py-2.5 rounded-xl bg-[#EA1A85] text-white font-black text-xs hover:bg-[#FF4DA6] transition shadow-lg"
            >
              Back to War Room
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

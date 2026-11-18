import React, { useEffect } from 'react';
import { WarRoomCanvas } from './components/canvas/WarRoomCanvas';
import { NavigationHUD } from './components/hud/NavigationHUD';
import { PlayerDossierHUD } from './components/hud/PlayerDossierHUD';
import { ProCompDuelModal } from './components/hud/ProCompDuelModal';
import { MilpPortfolioTable } from './components/hud/MilpPortfolioTable';
import { AuthorProfileModal } from './components/hud/AuthorProfileModal';
import { useWarRoomStore } from './store/useWarRoomStore';
import { Github, Linkedin, Phone, Globe, User } from 'lucide-react';

export const App: React.FC = () => {
  const { activeMode, setActiveMode, selectedPlayerId, selectPlayer, authorModalOpen, toggleAuthorModal } = useWarRoomStore();

  // Global ESC key listener to exit any modal/dossier back to 360° carousel view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (authorModalOpen) {
          toggleAuthorModal(false);
        } else if (activeMode !== 'CAROUSEL_3D') {
          setActiveMode('CAROUSEL_3D');
        }
        if (selectedPlayerId) {
          selectPlayer(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, setActiveMode, selectedPlayerId, selectPlayer, authorModalOpen, toggleAuthorModal]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#070C1E]">
      {/* 3D WebGL Spatial Arena Canvas */}
      <WarRoomCanvas />

      {/* Top Floating Glassmorphic Navigation HUD */}
      <NavigationHUD />

      {/* 6-Zone Tactile Player Dossier Drawer (Triggered when player is selected) */}
      <PlayerDossierHUD />

      {/* Pro-Comp Head-to-Head Duel Modal */}
      <ProCompDuelModal />

      {/* ₹26 Cr Optimal Squad Portfolio Table Modal */}
      <MilpPortfolioTable />

      {/* Samradh Sahni Profile & Verification Modal */}
      <AuthorProfileModal />

      {/* Bottom Floating Telemetry & Quick Help Bar */}
      <footer className="fixed bottom-3 left-4 right-4 sm:left-6 sm:right-6 z-10 pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="glass-panel px-3.5 py-1.5 rounded-xl flex items-center gap-2 pointer-events-auto text-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#EA1A85] animate-ping" />
          <span className="font-bold text-white text-[11px] sm:text-xs">Sawai Mansingh Stadium Pitch 3D</span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-[11px] text-[#FFD700] hidden md:inline">Drag to Orbit 360° • Left-click Card to inspect • Scroll to Zoom</span>
        </div>

        {/* Architect Attribution & Social Links Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {selectedPlayerId && (
            <button
              onClick={() => selectPlayer(null)}
              className="glass-panel px-3 py-1.5 rounded-xl text-xs font-bold text-white hover:bg-[#EA1A85] transition flex items-center gap-1.5"
            >
              <span>Reset 3D Camera</span>
            </button>
          )}

          <div className="glass-panel px-3 py-1.5 rounded-xl flex items-center gap-2.5 text-xs text-slate-300">
            <button
              onClick={() => toggleAuthorModal(true)}
              className="flex items-center gap-1.5 font-bold text-white hover:text-[#FFD700] transition"
              title="View Author Details"
            >
              <User size={13} className="text-[#EA1A85]" />
              <span>Samradh Sahni</span>
            </button>

            <span className="text-slate-600">|</span>

            <a
              href="https://github.com/SamradhSahni/RR_Selector"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition flex items-center gap-1"
              title="GitHub: SamradhSahni/RR_Selector"
            >
              <Github size={13} />
              <span className="hidden lg:inline text-[10px]">GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/samradhsahni/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-[#0077B5] transition flex items-center gap-1"
              title="LinkedIn: Samradh Sahni"
            >
              <Linkedin size={13} />
              <span className="hidden lg:inline text-[10px]">LinkedIn</span>
            </a>

            <a
              href="tel:7073949889"
              className="text-slate-400 hover:text-[#FFD700] transition flex items-center gap-1"
              title="Call Samradh Sahni: +91 7073949889"
            >
              <Phone size={13} />
              <span className="hidden xl:inline text-[10px] font-mono">+91 70739 49889</span>
            </a>

            <span className="text-slate-600">|</span>

            <a
              href="https://superrselector.samradhsahni.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#FFD700] font-bold hover:underline"
              title="Live Domain"
            >
              <Globe size={13} />
              <span className="hidden sm:inline text-[10px]">Live Site</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default App;

import React from 'react';
import { useWarRoomStore, SpatialViewMode, PlayerRoleFilter, RegimeFilter } from '../../store/useWarRoomStore';
import { Trophy, Shield, Flame, Zap, Users, Volume2, VolumeX, RotateCcw, RotateCw, Play, Pause, ArrowLeft, Github, Linkedin, Phone, User } from 'lucide-react';

export const NavigationHUD: React.FC = () => {
  const {
    activeMode,
    setActiveMode,
    activeRoleFilter,
    setActiveRoleFilter,
    activeRegimeFilter,
    setActiveRegimeFilter,
    lbmoStressTestActive,
    toggleLbmoStressTest,
    soundEnabled,
    toggleSound,
    isAutoRotating,
    toggleAutoRotate,
    rotateStep,
    resetView,
    selectedPlayerId,
    selectPlayer,
    toggleAuthorModal,
  } = useWarRoomStore();

  const roleFilters: { id: PlayerRoleFilter; label: string }[] = [
    { id: 'ALL', label: 'ALL 20 TITANS' },
    { id: 'BATTER', label: 'TOP 10 BATTERS' },
    { id: 'BOWLER', label: 'TOP 10 BOWLERS' },
  ];

  const regimeFilters: { id: RegimeFilter; label: string; icon: any }[] = [
    { id: 'OVERALL', label: 'OVERALL CLUTCH', icon: Trophy },
    { id: 'CRISIS', label: 'CRISIS ARREST', icon: Shield },
    { id: 'ESCALATION', label: 'RATE ESCALATION', icon: Flame },
    { id: 'CRUNCH', label: 'KNIFE-EDGE CRUNCH', icon: Zap },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-4 flex flex-col gap-3">
      {/* Top Main Navigation Bar */}
      <div className="w-full flex items-center justify-between glass-panel px-4 sm:px-6 py-3 rounded-2xl pointer-events-auto">
        {/* Left: Branding & Competition Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EA1A85] via-[#FF4DA6] to-[#FFD700] p-0.5 flex items-center justify-center shadow-lg shadow-[#EA1A85]/30">
            <div className="w-full h-full bg-[#001D4A] rounded-[10px] flex items-center justify-center font-black text-lg text-[#FFD700]">
              RR
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider text-white">RAJASTHAN ROYALS</span>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#EA1A85] text-white tracking-widest shadow-md">
                SupeRR Selector S2
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#FFD700] tracking-wide">
              Hall of Clutch Titans • 360° Interactive Spatial Arena
            </p>
          </div>
        </div>

        {/* Center: Modes & Active Back Button */}
        <div className="flex items-center gap-2">
          {activeMode === 'MILP_WAR_TABLE' ? (
            <button
              onClick={() => setActiveMode('CAROUSEL_3D')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#EA1A85] to-[#FFD700] text-black shadow-[0_0_30px_rgba(234,26,133,0.5)] hover:scale-105 transition"
            >
              <ArrowLeft size={16} />
              <span>← BACK TO 360° ARENA</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#001433]/90 p-1.5 rounded-xl border border-[#EA1A85]/30">
              <button
                onClick={() => {
                  setActiveMode('CAROUSEL_3D');
                  selectPlayer(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition tracking-wide ${
                  activeMode === 'CAROUSEL_3D' || activeMode === 'PITCH_DOSSIER'
                    ? 'bg-gradient-to-r from-[#EA1A85] to-[#254AA5] text-white shadow-lg shadow-[#EA1A85]/40 border border-[#FFD700]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Trophy size={14} className="text-[#FFD700]" />
                <span>360° ARENA</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('MILP_WAR_TABLE');
                  selectPlayer(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition tracking-wide text-slate-300 hover:text-white hover:bg-white/5"
              >
                <Users size={14} className="text-[#FFD700]" />
                <span>₹26 CR SQUAD TABLE</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: 360-Degree Controls & Sound Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 360° Rotation Controller Buttons */}
          <div className="hidden lg:flex items-center gap-1 bg-[#001433]/90 px-2 py-1 rounded-xl border border-white/15">
            <span className="text-[10px] font-black uppercase text-[#FFD700] px-1.5">360°:</span>
            <button
              onClick={() => rotateStep(0.35)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#EA1A85] text-white transition text-xs font-bold"
              title="Rotate 360° Left"
            >
              <RotateCcw size={13} />
            </button>
            <button
              onClick={toggleAutoRotate}
              className={`p-1.5 rounded-lg transition text-xs font-bold flex items-center gap-1 ${
                isAutoRotating ? 'bg-[#EA1A85] text-white' : 'bg-white/5 text-slate-300 hover:bg-white/15'
              }`}
              title={isAutoRotating ? 'Pause 360° Auto-Spin' : 'Resume 360° Auto-Spin'}
            >
              {isAutoRotating ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              onClick={() => rotateStep(-0.35)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#EA1A85] text-white transition text-xs font-bold"
              title="Rotate 360° Right"
            >
              <RotateCw size={13} />
            </button>
            <button
              onClick={resetView}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-[#FFD700] hover:text-black text-slate-300 text-[10px] font-black transition"
            >
              RESET
            </button>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-white/10 hover:bg-[#EA1A85] text-white transition pointer-events-auto"
            title="Toggle Stadium Audio"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Samradh Sahni Profile & Social Links Cluster */}
          <div className="flex items-center gap-1.5 bg-[#001433]/90 p-1.5 rounded-xl border border-[#FFD700]/40">
            <button
              onClick={() => toggleAuthorModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#EA1A85] to-[#FFD700] text-black font-black text-xs hover:scale-105 transition shadow"
              title="View Architect Profile (Samradh Sahni)"
            >
              <User size={13} />
              <span className="hidden sm:inline">Samradh Sahni</span>
            </button>

            <a
              href="https://github.com/SamradhSahni/RR_Selector"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-[#EA1A85] text-white transition"
              title="GitHub: SamradhSahni/RR_Selector"
            >
              <Github size={14} />
            </a>

            <a
              href="https://www.linkedin.com/in/samradhsahni/"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-[#0077B5] text-white transition"
              title="LinkedIn: Samradh Sahni"
            >
              <Linkedin size={14} />
            </a>

            <a
              href="tel:7073949889"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-[#EA1A85] text-white transition"
              title="Call Samradh Sahni: +91 7073949889"
            >
              <Phone size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Sub-Bar: Role Filters & Tactical Regime Pills */}
      {activeMode !== 'MILP_WAR_TABLE' && (
        <div className="w-full flex items-center justify-between pointer-events-auto flex-wrap gap-2">
          {/* Role Category Tabs */}
          <div className="flex items-center gap-1.5 glass-panel p-1.5 rounded-xl">
            {roleFilters.map((r) => {
              const isActive = activeRoleFilter === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRoleFilter(r.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition tracking-wide ${
                    isActive
                      ? 'bg-gradient-to-r from-[#EA1A85] to-[#FF4DA6] text-white shadow-md shadow-[#EA1A85]/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Tactical Regimes & LBMO Stress-Test Toggle */}
          <div className="flex items-center gap-2 glass-panel p-1.5 rounded-xl">
            <span className="text-[11px] font-black uppercase text-[#FFD700] px-2">REGIME:</span>
            {regimeFilters.map((reg) => {
              const Icon = reg.icon;
              const isActive = activeRegimeFilter === reg.id && !lbmoStressTestActive;
              return (
                <button
                  key={reg.id}
                  onClick={() => setActiveRegimeFilter(reg.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#EA1A85] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-[#FFD700]' : ''} />
                  <span>{reg.label}</span>
                </button>
              );
            })}

            {/* LBMO Live Stress Test Toggle Pill */}
            <button
              onClick={toggleLbmoStressTest}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-black transition border ${
                lbmoStressTestActive
                  ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.5)]'
                  : 'bg-white/5 text-[#FFD700] border-[#FFD700]/50 hover:bg-[#FFD700]/15'
              }`}
            >
              <Shield size={12} />
              <span>LBMO STRESS TEST</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

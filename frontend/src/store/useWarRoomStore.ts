import { create } from 'zustand';

export type SpatialViewMode = 'CAROUSEL_3D' | 'PITCH_DOSSIER' | 'PRO_COMP_DUEL' | 'MILP_WAR_TABLE';
export type PlayerRoleFilter = 'ALL' | 'BATTER' | 'BOWLER';
export type RegimeFilter = 'OVERALL' | 'CRISIS' | 'ESCALATION' | 'CRUNCH' | 'LBMO';

interface WarRoomStoreState {
  activeMode: SpatialViewMode;
  selectedPlayerId: string | null;
  selectedPlayerRole: 'BATTER' | 'BOWLER';
  activeRoleFilter: PlayerRoleFilter;
  activeRegimeFilter: RegimeFilter;
  lbmoStressTestActive: boolean;
  soundEnabled: boolean;
  isAutoRotating: boolean;
  manualRotationAngle: number;
  authorModalOpen: boolean;

  // Actions
  setActiveMode: (mode: SpatialViewMode) => void;
  selectPlayer: (playerId: string | null, role?: 'BATTER' | 'BOWLER') => void;
  setActiveRoleFilter: (role: PlayerRoleFilter) => void;
  setActiveRegimeFilter: (regime: RegimeFilter) => void;
  toggleLbmoStressTest: () => void;
  toggleSound: () => void;
  toggleAutoRotate: () => void;
  rotateStep: (delta: number) => void;
  resetView: () => void;
  toggleAuthorModal: (open?: boolean) => void;
}

export const useWarRoomStore = create<WarRoomStoreState>((set) => ({
  activeMode: 'CAROUSEL_3D',
  selectedPlayerId: null,
  selectedPlayerRole: 'BATTER',
  activeRoleFilter: 'ALL',
  activeRegimeFilter: 'OVERALL',
  lbmoStressTestActive: false,
  soundEnabled: true,
  isAutoRotating: true,
  manualRotationAngle: 0,
  authorModalOpen: false,

  toggleAuthorModal: (open) => set((state) => ({
    authorModalOpen: open !== undefined ? open : !state.authorModalOpen
  })),

  setActiveMode: (mode) => set((state) => ({
    activeMode: mode,
    selectedPlayerId: mode === 'MILP_WAR_TABLE' ? null : state.selectedPlayerId,
  })),
  
  selectPlayer: (playerId, role) => set((state) => ({
    selectedPlayerId: playerId,
    selectedPlayerRole: role || (playerId ? state.selectedPlayerRole : 'BATTER'),
    activeMode: playerId ? 'PITCH_DOSSIER' : (state.activeMode === 'PITCH_DOSSIER' ? 'CAROUSEL_3D' : state.activeMode),
    isAutoRotating: playerId ? false : state.isAutoRotating,
  })),

  setActiveRoleFilter: (role) => set({ activeRoleFilter: role }),

  setActiveRegimeFilter: (regime) => set((state) => ({
    activeRegimeFilter: regime,
    lbmoStressTestActive: regime === 'LBMO' ? true : state.lbmoStressTestActive,
  })),

  toggleLbmoStressTest: () => set((state) => ({
    lbmoStressTestActive: !state.lbmoStressTestActive,
    activeRegimeFilter: !state.lbmoStressTestActive ? 'LBMO' : 'OVERALL',
  })),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  toggleAutoRotate: () => set((state) => ({ isAutoRotating: !state.isAutoRotating })),

  rotateStep: (delta) => set((state) => ({
    manualRotationAngle: state.manualRotationAngle + delta,
    isAutoRotating: false,
  })),

  resetView: () => set({
    activeMode: 'CAROUSEL_3D',
    selectedPlayerId: null,
    manualRotationAngle: 0,
    isAutoRotating: true,
  }),
}));

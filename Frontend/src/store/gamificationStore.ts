import { create } from 'zustand';

export interface ChallengeItem {
  _id: string;
  title: string;
  description: string;
  xpReward: number;
  type: 'daily' | 'weekly';
  targetCategory?: string;
  active: boolean;
  status?: 'started' | 'completed' | 'not_started';
}

interface GamificationState {
  challenges: ChallengeItem[];
  leaderboard: { id: string; name: string; avatarUrl: string; xp: number; level: number }[];
  showLevelUpModal: boolean;
  newLevel: number;
  setChallenges: (challenges: ChallengeItem[]) => void;
  setLeaderboard: (leaderboard: any[]) => void;
  triggerLevelUp: (level: number) => void;
  closeLevelUp: () => void;
  updateChallengeStatus: (challengeId: string, status: 'started' | 'completed') => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  challenges: [],
  leaderboard: [],
  showLevelUpModal: false,
  newLevel: 1,

  setChallenges: (challenges) => set({ challenges }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  triggerLevelUp: (newLevel) => set({ showLevelUpModal: true, newLevel }),
  closeLevelUp: () => set({ showLevelUpModal: false }),
  updateChallengeStatus: (challengeId, status) =>
    set((state) => ({
      challenges: state.challenges.map((c) =>
        c._id === challengeId ? { ...c, status } : c
      )
    }))
}));

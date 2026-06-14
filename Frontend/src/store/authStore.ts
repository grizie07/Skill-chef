import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  dailyStreak: number;
  badges: { id: string; name: string; badgeUrl: string }[];
  isChef: boolean;
  role: 'user' | 'admin';
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  updateXP: (xp: number, level: number) => void;
  addBadge: (badge: { id: string; name: string; badgeUrl: string }) => void;
  syncMockUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('sc_token') : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('sc_user') || 'null') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('sc_token') : false,

  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sc_token', token);
      localStorage.setItem('sc_user', JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sc_token');
      localStorage.removeItem('sc_user');
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateXP: (xp, level) => {
    set((state) => {
      if (!state.user) return {};
      const updatedUser = { ...state.user, xp, level };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sc_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  addBadge: (badge) => {
    set((state) => {
      if (!state.user) return {};
      // Prevent duplicates
      if (state.user.badges.some((b) => b.id === badge.id)) return {};
      const updatedUser = {
        ...state.user,
        badges: [...state.user.badges, badge]
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sc_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  // Fallback mock session setup for testing without backend setup immediately
  syncMockUser: () => {
    set((state) => {
      if (state.user) return {};
      const mockUser: UserProfile = {
        id: 'mock-user-123',
        name: 'Guest Chef Alice',
        email: 'alice@skillchef.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        xp: 120,
        level: 1,
        dailyStreak: 3,
        badges: [
          {
            id: 'fresh_cook',
            name: 'Fresh Cook',
            badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
          }
        ],
        isChef: false,
        role: 'user'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sc_token', 'mock_jwt_token_xyz');
        localStorage.setItem('sc_user', JSON.stringify(mockUser));
      }
      return { token: 'mock_jwt_token_xyz', user: mockUser, isAuthenticated: true };
    });
  }
}));

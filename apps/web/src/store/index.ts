import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AppStore {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'trisetu_session',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

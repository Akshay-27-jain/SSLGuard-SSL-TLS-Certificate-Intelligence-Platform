import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthState['user']) => void;
  logout: () => void;
  setUser: (user: AuthState['user']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      setUser: (user) =>
        set({ user }),
    }),
    {
      name: 'ssl-checker-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

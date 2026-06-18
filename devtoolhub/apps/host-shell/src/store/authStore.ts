import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '@devtoolhub/shared-types';
import { setAuthToken } from '@devtoolhub/http-sdk';
import { eventBus } from '@devtoolhub/event-bus';

interface AuthStore {
  authState: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authState: { user: null, token: null, isAuthenticated: false },

      login: (user, token) => {
        setAuthToken(token);
        eventBus.emit('token-updated', { token, expiresAt: Date.now() + 3_600_000 });
        set({ authState: { user, token, isAuthenticated: true } });
      },

      logout: () => {
        setAuthToken(null);
        set({ authState: { user: null, token: null, isAuthenticated: false } });
      },

      refreshToken: (token) => {
        setAuthToken(token);
        eventBus.emit('token-updated', { token, expiresAt: Date.now() + 3_600_000 });
        set(state => ({ authState: { ...state.authState, token } }));
      },
    }),
    {
      name: 'devtoolhub-auth',
      partialize: state => ({ authState: state.authState }),
    }
  )
);

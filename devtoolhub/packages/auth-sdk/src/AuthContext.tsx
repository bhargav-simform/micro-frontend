import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '@devtoolhub/shared-types';

const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthState>(defaultAuthState);

export interface AuthProviderProps {
  value: AuthState;
  children: ReactNode;
}

export function AuthProvider({ value, children }: AuthProviderProps) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export { AuthContext };

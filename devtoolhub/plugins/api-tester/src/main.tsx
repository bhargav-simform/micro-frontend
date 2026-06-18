import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@devtoolhub/auth-sdk';
import type { AuthState } from '@devtoolhub/shared-types';
import App from './App';

const mockAuth: AuthState = {
  user: { id: '1', email: 'dev@devtoolhub.io', name: 'Dev User', roles: ['admin'] },
  token: 'mock-token',
  isAuthenticated: true,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider value={mockAuth}>
      <App pluginId="api-tester" />
    </AuthProvider>
  </StrictMode>
);

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'apiTester',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react/jsx-runtime': { singleton: true },
        '@devtoolhub/event-bus': { singleton: true },
        '@devtoolhub/auth-sdk': { singleton: true },
        '@devtoolhub/http-sdk': { singleton: true },
        '@devtoolhub/shared-types': { singleton: true },
      },
    }),
  ],
  server: { port: 3001, strictPort: true },
  build: { modulePreload: false, target: 'esnext', minify: false, cssCodeSplit: false },
});

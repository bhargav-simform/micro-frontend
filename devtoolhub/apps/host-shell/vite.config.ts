import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-shell',
      remotes: {
        // Placeholder forces the federation plugin to emit __federation_method_*
        // globals into the bundle. All actual remotes are registered at runtime
        // via __federation_method_setRemote in pluginLoader.ts.
        placeholder: 'http://localhost:1/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        '@devtoolhub/event-bus': { singleton: true },
        '@devtoolhub/auth-sdk': { singleton: true },
        '@devtoolhub/http-sdk': { singleton: true },
        '@devtoolhub/shared-types': { singleton: true },
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});

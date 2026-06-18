import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'jsonFormatter',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.vue' },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.4.0' },
        '@devtoolhub/event-bus': { singleton: true },
        '@devtoolhub/shared-types': { singleton: true },
      },
    }),
  ],
  server: { port: 3002, strictPort: true },
  build: { modulePreload: false, target: 'esnext', minify: false, cssCodeSplit: false },
});

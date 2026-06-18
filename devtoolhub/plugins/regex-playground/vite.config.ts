import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    svelte({ preprocess: sveltePreprocess() }),
    federation({
      name: 'regexPlayground',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.svelte' },
      shared: {
        svelte: { singleton: true, requiredVersion: '^4.2.0' },
        '@devtoolhub/event-bus': { singleton: true },
        '@devtoolhub/shared-types': { singleton: true },
      },
    }),
  ],
  server: { port: 3004, strictPort: true },
  build: { modulePreload: false, target: 'esnext', minify: false, cssCodeSplit: false },
});

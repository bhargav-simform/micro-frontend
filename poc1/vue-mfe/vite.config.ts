import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  define: {
    __MFE_VERSION__: JSON.stringify('1.0.0'),
    __MFE_NAME__: JSON.stringify('vue-mfe'),
  },
  plugins: [
    vue({
      customElement: true,
    }),
    federation({
      name: 'vue-mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './bootstrap': './src/bootstrap.ts',
      },
      // Vue is NOT shared — it stays isolated from the React host's module graph
      shared: [],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})

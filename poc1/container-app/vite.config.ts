import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'container-app',
      remotes: {
        'mfe-app': 'http://localhost:5001/assets/remoteEntry.js',
        'header-app': 'http://localhost:5002/assets/remoteEntry.js',
        'vue-mfe': 'http://localhost:5003/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})

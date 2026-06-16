import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfe-app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './authStore': './src/authStore.ts',
        './Page1': './src/pages/Page1.tsx',
        './Page2': './src/pages/Page2.tsx',
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

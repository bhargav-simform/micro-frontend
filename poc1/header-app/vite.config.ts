import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  define: {
    __MFE_VERSION__: JSON.stringify('1.0.0'),
    __MFE_NAME__: JSON.stringify('header-app'),
  },
  plugins: [
    react(),
    federation({
      name: 'header-app',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/App.tsx',
        './WorkflowReview': './src/components/WorkflowReview.tsx',
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

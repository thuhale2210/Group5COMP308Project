import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'userApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
    }),
  ],
  server: {
    port: 3001,
    cors: {
      origin: ['http://localhost:3000', 'https://community-engagement-app.onrender.com'],
      credentials: true
    }, strictPort: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shellApp',
      remotes: {
        userApp: 'https://client-user-app.onrender.com/assets/remoteEntry.js',
        communityApp: 'https://client-community-app.onrender.com/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
    }),
  ],
  server: {
    port: 3000,
    cors: true,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
});
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import federation from '@originjs/vite-plugin-federation';

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: "auth",
//       filename: "remoteEntry.js",
//       exposes: {
//         "./Login": "./src/LoginComponent.jsx",
//         "./Signup": "./src/SignupComponent.jsx",
//       }
//     })
//   ],
//   server: {
//     port: 5001,
//   },
//   build: {
//     target: "esnext",
//   },
// });


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
    cors: true,
    strictPort: true,
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
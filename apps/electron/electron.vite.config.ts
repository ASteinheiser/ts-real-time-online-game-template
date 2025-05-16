import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

const externalDepsPlugin = externalizeDepsPlugin({
  // We need vite to build these files
  exclude: ['@repo/core-game'],
});

export default defineConfig({
  main: {
    plugins: [externalDepsPlugin],
    build: {
      outDir: 'dist/main',
    },
  },
  preload: {
    plugins: [externalDepsPlugin],
    build: {
      outDir: 'dist/preload',
    },
  },
  renderer: {
    plugins: [react()],
    server: {
      port: 4202,
    },
    build: {
      outDir: 'dist/renderer',
    },
  },
});

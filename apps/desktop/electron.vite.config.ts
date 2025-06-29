import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// NOTE: this is only used for dev purposes. Vite will build the
// site into static files, so the PORT won't be relevant in prod
const PORT = 4202;

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/main',
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload',
    },
  },
  renderer: {
    plugins: [react(), tailwindcss()],
    server: {
      port: PORT,
    },
    build: {
      outDir: 'dist/renderer',
    },
  },
});

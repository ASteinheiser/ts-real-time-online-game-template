import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 4200,
  },
  preview: {
    host: '0.0.0.0',
    port: 4200,
  },
});

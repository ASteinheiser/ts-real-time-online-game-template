import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        format: 'esm',
      },
      external: [
        // Node.js built-ins
        'fs',
        'path',
        'http',
        'https',
        'url',
        'util',
        'os',
        'stream',
        'crypto',
        'zlib',
        'events',
        'assert',
        'buffer',
        // External npm dependencies
        'express',
        'nanoid',
      ],
    },
  },
});

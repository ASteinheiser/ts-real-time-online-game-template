import { defineConfig } from 'vite';
import { resolve } from 'path';
import { builtinModules } from 'module';

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
        ...builtinModules,
        // npm dependencies that are NOT ESM-compatible
        '@colyseus/core',
        '@colyseus/monitor',
        '@colyseus/playground',
        '@colyseus/schema',
        '@colyseus/tools',
      ],
    },
  },
});

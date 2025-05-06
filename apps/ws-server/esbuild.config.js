import { build } from 'esbuild';
import process from 'node:process';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  format: 'esm',
  // Mark only node modules as external, not workspace packages
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
    '@colyseus/core',
    '@colyseus/monitor',
    '@colyseus/playground',
    '@colyseus/schema',
    '@colyseus/tools',
    'express',
    'colyseus',
    'nanoid',
  ],
  // This will properly resolve .ts files
  resolveExtensions: ['.ts', '.js', '.json'],
  // Include source maps for debugging
  sourcemap: true,
}).catch(() => process.exit(1));

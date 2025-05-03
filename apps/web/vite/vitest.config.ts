import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './config.dev';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'web',
    },
  })
);

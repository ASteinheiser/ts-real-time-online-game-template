import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './dev.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'web',
      watch: false,
    },
  })
);

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'ws-server',
    coverage: {
      enabled: true,
    },
  },
});

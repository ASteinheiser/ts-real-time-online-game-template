import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'ws-server',
    testTimeout: 15000,
    coverage: { enabled: false },
  },
});

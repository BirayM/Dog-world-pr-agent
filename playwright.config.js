import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3100' },
  webServer: process.env.BASE_URL ? undefined : {
    command: 'node src/server.js',
    env: { PORT: '3100' },
    url: 'http://localhost:3100/healthz',
    reuseExistingServer: !process.env.CI,
  },
});

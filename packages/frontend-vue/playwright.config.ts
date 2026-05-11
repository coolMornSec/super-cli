import { defineConfig } from '@playwright/test'

import { fileURLToPath } from 'node:url'

const frontendRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    channel: 'msedge',
    trace: 'on-first-retry',
    launchOptions: {
      env: {
        ...process.env,
        ESBUILD_BINARY_PATH: process.env.ESBUILD_BINARY_PATH || '',
      },
    },
  },
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173',
      cwd: frontendRoot,
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})

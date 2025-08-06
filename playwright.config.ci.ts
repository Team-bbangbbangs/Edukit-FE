import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, devices } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: true,
  retries: 2,
  workers: 1,

  reporter: [['list'], ['html', { outputFolder: 'test-results/html-report' }]],

  use: {
    baseURL: 'https://edukit.co.kr',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
          ],
        },
      },
    },
  ],

  timeout: 90000,
  expect: {
    timeout: 30000,
  },

  globalSetup: resolve(__dirname, './tests/global-setup.ts'),
});

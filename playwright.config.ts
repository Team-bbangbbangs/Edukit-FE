import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

if (!process.env.CI) {
  config({ path: '.env.test' });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'https://edukit.co.kr',
    headless: process.env.CI ? true : false,
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: process.env.CI
          ? {
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
              ],
            }
          : undefined,
      },
    },
  ],

  timeout: 60000,
  expect: {
    timeout: 30000,
  },
});

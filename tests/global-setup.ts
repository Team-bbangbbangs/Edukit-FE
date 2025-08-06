import { execSync } from 'child_process';

import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 E2E Global Setup Starting...');

  // 1. Playwright 설치 확인
  try {
    const version = execSync('npx playwright --version', { encoding: 'utf8' });
    console.log('✅ Playwright version:', version.trim());
  } catch {
    console.error('❌ Playwright not installed');
    throw new Error('Playwright is not installed or not accessible');
  }

  // 2. 환경 변수 확인
  const requiredEnvVars = [
    'TEST_USER_EMAIL',
    'TEST_USER_PASSWORD',
    'TEST_UNVERIFIED_USER_EMAIL',
    'TEST_UNVERIFIED_USER_PASSWORD',
  ];

  console.log('🔍 Checking required environment variables...');
  const missingVars = requiredEnvVars.filter((envVar) => {
    const exists = !!process.env[envVar];
    console.log(`${envVar}: ${exists ? '✅ SET' : '❌ NOT SET'}`);
    return !exists;
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars);
    console.error('Please check Amplify environment variables configuration');
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  console.log('✅ All environment variables are set');

  // 3. 브라우저 연결 테스트
  try {
    console.log('🌐 Testing browser connection...');
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    const baseURL = config.projects[0]?.use?.baseURL || 'https://edukit.co.kr';
    console.log(`🔗 Connecting to ${baseURL}...`);

    await page.goto(baseURL, { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    console.log(`✅ Successfully connected - Title: "${title}"`);

    if (!title || title.includes('Error') || title.includes('404')) {
      throw new Error(`Invalid page response: ${title}`);
    }

    await browser.close();
  } catch (error) {
    console.error('❌ Browser connection test failed:', error);
    throw new Error(`Failed to connect to test site`);
  }

  console.log('🎉 Global setup completed successfully - Ready for E2E tests!');
}

export default globalSetup;

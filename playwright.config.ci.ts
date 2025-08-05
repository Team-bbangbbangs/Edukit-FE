import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false, // CI에서는 직렬 실행으로 안정성 확보
  forbidOnly: true, // CI에서는 .only 테스트 금지
  retries: 2, // CI에서는 재시도 횟수 증가
  workers: 1, // CI에서는 단일 워커로 실행

  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    ['list'], // 콘솔 출력용
  ],

  use: {
    baseURL: 'https://edukit.co.kr', // 실제 배포된 사이트 테스트
    headless: true, // CI에서는 헤드리스 모드 필수
    trace: 'retain-on-failure', // 실패 시에만 트레이스 저장
    screenshot: 'only-on-failure', // 실패 시에만 스크린샷
    video: 'retain-on-failure', // 실패 시에만 비디오 저장
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // CI 환경에서 안정성을 위한 추가 설정
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
          ],
        },
      },
    },
  ],

  // CI에서는 외부 서버 사용하므로 webServer 설정 제거

  // 타임아웃 설정
  timeout: 60000, // 60초
  expect: {
    timeout: 30000, // 30초
  },
});

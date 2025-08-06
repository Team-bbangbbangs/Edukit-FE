import { expect, type Page } from '@playwright/test';

// 로그인 여부를 확인하는 헬퍼 함수
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    const profileImage = page.locator('header img[alt="profile image"]');
    const isProfileVisible = await profileImage.isVisible();

    if (!isProfileVisible) {
      return false;
    }

    await profileImage.click();
    await page.waitForTimeout(500);

    const logoutButton = page.locator('button:has-text("로그아웃")');
    const hasLogoutButton = await logoutButton.isVisible();

    await page.click('body');

    return hasLogoutButton;
  } catch {
    return false;
  }
}

// 서버 에러 (alert) 메시지 확인 헬퍼 함수
export async function expectAlertMessage(page: Page, expectedMessage: string) {
  page.removeAllListeners('dialog');

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toBe(expectedMessage);
    await dialog.accept();
  });
}

// 환경 변수 검증 함수
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`test 환경 변수가 존재하지 않습니다.`);
  }
  return value;
}

// 테스트 계정 정보 가져오기
export function getTestCredentials() {
  return {
    user: {
      email: getRequiredEnv('TEST_USER_EMAIL'),
      password: getRequiredEnv('TEST_USER_PASSWORD'),
    },
    unverified: {
      email: getRequiredEnv('TEST_UNVERIFIED_USER_EMAIL'),
      password: getRequiredEnv('TEST_UNVERIFIED_USER_PASSWORD'),
    },
  };
}

export function getUserEmail(): string {
  return getRequiredEnv('TEST_USER_EMAIL');
}

export function getUserPassword(): string {
  return getRequiredEnv('TEST_USER_PASSWORD');
}

export function getUnverifiedPassword(): string {
  return getRequiredEnv('TEST_UNVERIFIED_USER_PASSWORD');
}

// 편의 로그인 함수들
export async function loginAsUser(page: Page) {
  const { user } = getTestCredentials();
  await performLogin(page, user.email, user.password);
}

export async function loginAsUnverified(page: Page) {
  const { unverified } = getTestCredentials();
  await performLogin(page, unverified.email, unverified.password);
}

// 로그인을 수행하는 헬퍼 함수
export async function performLogin(page: Page, email: string, password: string) {
  await page.goto('/login');

  await page.fill('input[placeholder="이메일"]', email);
  await page.fill('input[placeholder="비밀번호"]', password);

  await page.click('button[type="submit"]:has-text("로그인")');

  await page.waitForTimeout(1000);
}

// 로그아웃을 수행하는 헬퍼 함수
export async function performLogout(page: Page) {
  await page.click('header img[alt="profile image"]');

  await page.click('button:has-text("로그아웃")');
}

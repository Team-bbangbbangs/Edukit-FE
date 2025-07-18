import { expect, type Page } from '@playwright/test';

type ApiMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

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

// 로그인을 수행하는 헬퍼 함수
export async function performLogin(page: Page, email: string, password: string) {
  await page.goto('/login');

  await page.fill('input[placeholder="이메일"]', email);
  await page.fill('input[placeholder="비밀번호"]', password);

  await page.click('button[type="submit"]:has-text("로그인")');
}

// 로그아웃을 수행하는 헬퍼 함수
export async function performLogout(page: Page) {
  await page.click('header img[alt="profile image"]');

  await page.click('button:has-text("로그아웃")');
}

// API 응답 상태를 확인하는 헬퍼 함수
export async function waitForApiResponse(
  page: Page,
  url: string,
  method: ApiMethod,
  expectedStatus: number = 200,
): Promise<void> {
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes(url) && response.request().method() === method,
  );

  const response = await responsePromise;
  expect(response.status()).toBe(expectedStatus);
}

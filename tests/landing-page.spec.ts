import { test, expect } from '@playwright/test';

test.describe('Edukit 랜딩 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지 메타데이터가 올바르게 설정되어 있다', async ({ page }) => {
    await expect(page).toHaveTitle('EduMate');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      '교사를 위한 AI 기반 생활기록부 작성 및 관리 서비스',
    );

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ko');
  });

  test('랜딩 페이지 이미지가 표시된다', async ({ page }) => {
    const landingImage = page.locator('img[alt="랜딩 페이지 이미지"]');

    await expect(landingImage).toBeVisible();
    await expect(landingImage).toHaveAttribute('width', '1000');
  });

  test('학생 관리 카드가 보여야 하고, 링크로 이동해야 한다', async ({ page }) => {
    const link = page.getByRole('link', { name: /나의 학생 관리/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/manage-subject/);
  });

  test('생기부 작성 카드가 보여야 하고, 링크로 이동해야 한다', async ({ page }) => {
    const link = page.getByRole('link', { name: /생기부 작성 기능/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/write-subject/);
  });

  test('페이지가 빠르게 로드된다', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);

    await expect(page.locator('img[alt="랜딩 페이지 이미지"]')).toBeVisible();

    await expect(page.getByRole('link', { name: /나의 학생 관리/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /생기부 작성 기능/ })).toBeVisible();
  });
});

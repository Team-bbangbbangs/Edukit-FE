import { test, expect } from '@playwright/test';

test.describe('공지사항 기본 기능 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notice');
    await page.waitForLoadState('domcontentloaded');
  });

  test('1. 공지사항 목록이 잘 나온다.', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('공지사항');

    const noticeItems = page.locator('a[href^="/notice/"]');
    await expect(noticeItems.first()).toBeVisible();

    const firstNotice = noticeItems.first();

    const tagElement = firstNotice.locator('span').first();
    await expect(tagElement).toHaveText(/^(공지|이벤트)$/);

    const titleText = await firstNotice.locator('span').nth(1).textContent();
    expect(titleText?.trim()).not.toBe('');

    const dateElement = firstNotice.locator('time');
    if (await dateElement.isVisible()) {
      const dateText = await dateElement.textContent();
      expect(dateText).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/);
    }
  });

  test('2. 공지사항이 없는 쿼리 파라미터로 접근할 때 ErrorNotice 컴포넌트가 표시된다', async ({
    page,
  }) => {
    await page.goto('/notice?page=10');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=등록된 공지사항이 없습니다.')).toBeVisible();

    await page.goto('/notice/1231231');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=등록된 공지사항이 없습니다.')).toBeVisible();
  });

  test('3. 공지 태그 필터링이 올바르게 작동한다', async ({ page }) => {
    await page.click('a[href="/notice?categoryId=2"]');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL('/notice?categoryId=2');

    const activeCategory = page.locator('a[href="/notice?categoryId=2"]');
    await expect(activeCategory).toHaveClass(/bg-slate-800/);

    const noticeItems = page.locator('a[href^="/notice/"]');
    const count = await noticeItems.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const tag = noticeItems.nth(i).locator('span').first();
        await expect(tag).toHaveText('공지');
      }
    }
  });

  test('4. 이벤트 태그 필터링이 올바르게 작동한다', async ({ page }) => {
    await page.click('a[href="/notice?categoryId=3"]');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL('/notice?categoryId=3');

    const activeCategory = page.locator('a[href="/notice?categoryId=3"]');
    await expect(activeCategory).toHaveClass(/bg-slate-800/);

    const noticeItems = page.locator('a[href^="/notice/"]');
    const count = await noticeItems.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const tag = noticeItems.nth(i).locator('span').first();
        await expect(tag).toHaveText('이벤트');
      }
    }
  });

  test('5. 페이지네이션이 올바르게 동작한다', async ({ page }) => {
    const page2Button = page.locator('a[href="/notice?page=2"]');

    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL('/notice?page=2');

      const noticeItems = page.locator('a[href^="/notice/"]');
      if ((await noticeItems.count()) > 0) {
        await expect(noticeItems.first()).toBeVisible();
      }
    }
  });

  test('6. 카테고리와 페이지네이션이 함께 정상적으로 동작한다', async ({ page }) => {
    await page.click('a[href="/notice?categoryId=2"]');
    await page.waitForLoadState('domcontentloaded');

    const page2Button = page.locator('a[href*="categoryId=2"][href*="page=2"]');

    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL('/notice?categoryId=2&page=2');

      const noticeItems = page.locator('a[href^="/notice/"]');
      const count = await noticeItems.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const tag = noticeItems.nth(i).locator('span').first();
          await expect(tag).toHaveText('공지');
        }
      }
    }
  });

  test('7. 공지사항 상세 페이지 조회 및 뒤로가기가 작동한다', async ({ page }) => {
    const firstNotice = page.locator('a[href^="/notice/"]').first();
    const originalTitle = await firstNotice.locator('span').nth(1).textContent();
    const originalTag = await firstNotice.locator('span').first().textContent();
    const noticeHref = await firstNotice.getAttribute('href');

    await firstNotice.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(noticeHref!);

    const detailTag = page.locator('h2').first();
    const detailTitle = page.locator('h3').first();
    const detailDate = page.locator('span.text-slate-600').first();
    const detailContent = page.locator('div.prose');

    await expect(detailTag).toBeVisible();
    const detailTagText = await detailTag.textContent();
    expect(detailTagText).toBe(originalTag);

    await expect(detailTitle).toBeVisible();
    const detailTitleText = await detailTitle.textContent();
    expect(detailTitleText).toBe(originalTitle);

    await expect(detailDate).toBeVisible();
    const detailDateText = await detailDate.textContent();
    expect(detailDateText).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/);

    await expect(detailContent).toBeVisible();
    const contentText = await detailContent.textContent();
    expect(contentText).toBeTruthy();

    const backButton = page.locator('a[href="/notice"]:has-text("돌아가기")');
    await expect(backButton).toBeVisible();

    await backButton.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL('/notice');
    await expect(page.locator('h2:has-text("공지사항")')).toBeVisible();
  });

  test('8. URL로 직접 접근 시 올바른 데이터가 표시된다', async ({ page }) => {
    await page.goto('/notice?categoryId=2&page=2');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL('/notice?categoryId=2&page=2');

    const activeCategory = page.locator('a[href="/notice?categoryId=2"]');
    await expect(activeCategory).toHaveClass(/bg-slate-800/);

    const noticeItems = page.locator('a[href^="/notice/"]');
    if ((await noticeItems.count()) > 0) {
      await expect(noticeItems.first()).toBeVisible();

      const count = await noticeItems.count();
      for (let i = 0; i < count; i++) {
        const tag = noticeItems.nth(i).locator('span').first();
        await expect(tag).toHaveText('공지');
      }
    }
  });

  test('9. 브라우저 새로고침 시 상태가 유지된다', async ({ page }) => {
    await page.goto('/notice?categoryId=3&page=1');
    await page.waitForLoadState('domcontentloaded');

    await page.reload();

    await expect(page).toHaveURL('/notice?categoryId=3&page=1');

    const activeCategory = page.locator('a[href="/notice?categoryId=3"]');
    await expect(activeCategory).toHaveClass(/bg-slate-800/);

    const noticeItems = page.locator('a[href^="/notice/"]');
    if ((await noticeItems.count()) > 0) {
      await expect(noticeItems.first()).toBeVisible();

      const count = await noticeItems.count();
      for (let i = 0; i < count; i++) {
        const tag = noticeItems.nth(i).locator('span').first();
        await expect(tag).toHaveText('이벤트');
      }
    }
  });

  test('10. 페이지네이션 경계값에서 <, > 버튼 상태가 올바르다', async ({ page }) => {
    await page.goto('/notice');
    await page.waitForLoadState('domcontentloaded');

    const firstPagePrevButton = page.locator('span.text-slate-300:has-text("<")');
    await expect(firstPagePrevButton).toBeVisible();

    const nextButton = page.locator('a[href*="page="]:has-text(">")');
    const nextButtonDisabled = page.locator('span.text-slate-300:has-text(">")');

    const isNextButtonClickable = await nextButton.isVisible();

    if (!isNextButtonClickable) {
      await expect(nextButtonDisabled).toBeVisible();
    } else {
      const maxIterations = 20;
      let iterations = 0;

      while (iterations < maxIterations) {
        const isNextClickable = await nextButton.isVisible();

        if (!isNextClickable) {
          break;
        }

        await nextButton.click();
        await page.waitForLoadState('domcontentloaded');

        iterations++;

        await page.waitForTimeout(500);
      }

      const finalNextButton = page.locator('span.text-slate-300:has-text(">")');
      await expect(finalNextButton).toBeVisible();

      const finalPrevButton = page.locator('a[href*="page="]:has-text("<")');
      await expect(finalPrevButton).toBeVisible();
    }
  });
});

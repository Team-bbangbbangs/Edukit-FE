import { test, expect } from '@playwright/test';

import { performLogin, performLogout, expectAlertMessage } from '../utils/test-helpers';

test.describe('공지사항 어드민 기능 E2E 테스트', () => {
  test('1. 어드민 계정일 때 글쓰기 버튼이 잘 보이고, 일반 계정일때 글쓰기 버튼이 안보인다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/notice');

    const writeButtonAsUser = page.locator('a[href="/notice/write-notice"]');
    await expect(writeButtonAsUser).not.toBeVisible();

    await performLogout(page);

    await performLogin(page, 'admin@edukit.co.kr', 'password1234');
    await page.goto('/notice');

    const writeButtonAsAdmin = page.locator('a[href="/notice/write-notice"]');
    await expect(writeButtonAsAdmin).toBeVisible();
  });

  test('2. 글쓰기 버튼을 눌렀을때 공지사항 작성 페이지로 넘어가고 태그, 제목, 컨텐츠를 입력해서 작성하기 버튼을 누르면 작성한 내용이 잘 반영된다', async ({
    page,
  }) => {
    await performLogin(page, 'admin@edukit.co.kr', 'password1234');
    await page.goto('/notice');

    await page.click('a[href="/notice/write-notice"]');
    await expect(page).toHaveURL('/notice/write-notice');

    await page.click('button:has-text("이벤트")');
    await page.fill('input[placeholder="제목"]', '테스트 공지사항 제목');
    await page.locator('.ProseMirror').fill('테스트 공지사항 내용입니다.');

    let responseStatus = 0;
    page.on('response', (response) => {
      if (
        response.url().includes('/api/v1/admin/notices') &&
        response.request().method() === 'POST'
      ) {
        responseStatus = response.status();
      }
    });

    await page.click('button:has-text("작성하기")');
    await page.waitForTimeout(1000);
    expect(responseStatus).toBe(200);
    await expect(page).toHaveURL('/notice');
  });

  test('3. 어드민 계정일 때 공지사항 상세 페이지 들어가면 수정하기/삭제하기 버튼이 보이고, 일반 계정일때 수정하기/삭제하기 버튼이 안보인다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/notice');

    await page.locator('a[href^="/notice/"]').first().click();

    await expect(page.locator('a:has-text("수정하기")')).not.toBeVisible();
    await expect(page.locator('button:has-text("삭제하기")')).not.toBeVisible();

    await performLogout(page);

    await performLogin(page, 'admin@edukit.co.kr', 'password1234');
    await page.goto('/notice');

    await page.locator('a[href^="/notice/"]').first().click();

    await expect(page.locator('a:has-text("수정하기")')).toBeVisible();
    await expect(page.locator('button:has-text("삭제하기")')).toBeVisible();
  });

  test('4. 수정하기 버튼 누르고 태그, 제목, 컨텐츠 수정해서 수정하기 버튼 누르면 수정된 내용이 잘 반영된다', async ({
    page,
  }) => {
    await performLogin(page, 'admin@edukit.co.kr', 'password1234');
    await page.goto('/notice');

    await page.locator('a[href^="/notice/"]').first().click();

    await page.click('a:has-text("수정하기")');

    await expect(page).toHaveURL('/notice/edit-notice/1');

    await page.click('button:has-text("공지")');
    await page.fill('input[placeholder="제목"]', '수정');
    await page.locator('.ProseMirror').fill('수정');

    let responseStatus = 0;
    page.on('response', (response) => {
      if (
        response.url().includes('/api/v1/admin/notices') &&
        response.request().method() === 'PATCH'
      ) {
        responseStatus = response.status();
      }
    });

    await page.click('button:has-text("수정하기")');
    await page.waitForTimeout(1000);
    expect(responseStatus).toBe(200);

    await expect(page).toHaveURL('/notice/1');
  });

  test('5. 삭제하기 버튼 누르면 삭제 모달이 잘 나오고 삭제 버튼을 클릭하면 게시물 삭제가 잘 된다', async ({
    page,
  }) => {
    await performLogin(page, 'admin@edukit.co.kr', 'password1234');
    await page.goto('/notice');

    await page.locator('a[href^="/notice/"]').first().click();

    await page.click('button:has-text("삭제하기")');

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=정말 삭제하시겠습니까?')).toBeVisible();

    let responseStatus = 0;
    page.on('response', (response) => {
      if (
        response.url().includes('/api/v1/admin/notices') &&
        response.request().method() === 'DELETE'
      ) {
        responseStatus = response.status();
      }
    });

    await page.locator('[role="dialog"] button:has-text("삭제")').click();
    await page.waitForTimeout(1000);
    expect(responseStatus).toBe(200);

    await expect(page).toHaveURL('/notice');
  });

  test('6. 공지사항 작성할때 에러나면 에러 UI가 잘 나온다', async ({ page }) => {
    // 일반 유저 계정으로 로그인
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/notice/write-notice');

    await page.fill('input[placeholder="제목"]', '제목');
    await page.locator('.ProseMirror').fill('내용');

    await expectAlertMessage(page, '관리자 권한이 필요합니다.');
    await page.click('button:has-text("작성하기")');

    await page.waitForTimeout(500);
    await performLogout(page);

    // 제목 or 내용이 비워져 있는 경우
    await performLogin(page, 'admin@edukit.co.kr', 'password1234');
    await page.goto('/notice/write-notice');

    await page.fill('input[placeholder="제목"]', '제목만 있는 공지사항');
    await page.locator('.ProseMirror').clear();

    await expectAlertMessage(page, '제목과 내용을 모두 입력해주세요.');
    await page.click('button:has-text("작성하기")');

    await page.waitForTimeout(500);

    await page.fill('input[placeholder="제목"]', '');
    await page.locator('.ProseMirror').clear();
    await page.locator('.ProseMirror').fill('내용만 있는 공지사항');

    await expectAlertMessage(page, '제목과 내용을 모두 입력해주세요.');
    await page.click('button:has-text("작성하기")');

    await page.waitForTimeout(500);
  });

  test('7. 공지사항 수정할때 에러나면 에러 UI가 잘 나온다', async ({ page }) => {
    // 일반 유저 계정으로 로그인
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/notice/edit-notice/1');
    await expectAlertMessage(page, '관리자 권한이 필요합니다.');

    await page.fill('input[placeholder="제목"]', '수정할 제목');
    await page.locator('.ProseMirror').fill('수정할 내용');

    await page.click('button:has-text("수정하기")');

    await performLogout(page);

    // 존재하지 않는 공지사항 ID로 상세 페이지 접근
    await performLogin(page, 'admin@edukit.co.kr', 'password1234');

    await page.goto('/notice/edit-notice/999');

    await expect(page.locator('text=등록된 공지사항이 없습니다.')).toBeVisible();

    // 제목 or 내용이 비워져 있는 경우
    await page.goto('/notice/edit-notice/1');
    await page.fill('input[placeholder="제목"]', '');
    await page.locator('.ProseMirror').fill('');

    await expectAlertMessage(page, '제목과 내용을 모두 입력해주세요.');

    await page.click('button:has-text("수정하기")');
  });

  test('8. 공지사항 삭제할때 에러나면 에러 UI가 잘 나온다', async ({ page }) => {
    // 존재하지 않는 공지사항 ID로 상세 페이지 접근
    await performLogin(page, 'admin@edukit.co.kr', 'password1234');

    await page.goto('/notice/999');

    await expect(page.locator('text=등록된 공지사항이 없습니다.')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

import { performLogin, performLogout, expectAlertMessage } from './utils/test-helpers';

test.describe('생활기록부 작성 E2E 테스트', () => {
  test('1. 로그인이 안되어 있는 상태에서 사이드바의 학교 생활기록부 작성 하위 항목인 행동특성 및 종합의견을 클릭해서 들어가면 로그인이 필요합니다 라는 텍스트가 나온다.', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('a[href="/write-behavior"]');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();
  });

  test('2. 이메일 인증하지 않은 유저가 로그인 하고 사이드바의 학교 생활기록부 작성 하위 항목인 행동 특성 및 종합의견을 클릭해서 들어가면 이메일을 인증해주세요 라는 텍스트가 나오고, 로그아웃을 하고 다시 들어가면 로그인이 필요합니다 라는 텍스트가 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test123@edukit.co.kr', 'ab12345678');
    await page.click('a[href="/write-behavior"]');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=이메일 인증 후 서비스 이용이 가능합니다.')).toBeVisible();

    await performLogout(page);
    await page.goto('/write-behavior');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();
  });

  test('3. 로그인 하고 사이드바의 학교 생활기록부 작성 하위 항목인 창의적 체험 활동 - 자율을 클릭해서 들어가면 아직 등록된 생활기록부가 없어요 라는 텍스트가 나오고, 로그아웃을 하고 다시 들어가면 로그인이 필요합니다 라는 텍스트가 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'bbangs$00');
    await page.click('a[href="/write-free"]');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=아직 등록된 생활기록부가 없어요')).toBeVisible();

    await performLogout(page);
    await page.goto('/write-free');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();
  });

  test('4. 로그인하고 write-subject 링크로 들어오면 /write-subject?recordId=972으로 리다이렉팅 되고 종합 파트에 학생의 종합 텍스트가 나오고, 이름 드롭다운을 클릭해서 윤다은을 클릭하면 /write-subject?recordId=975으로 리다이렉팅 되고, 종합 파트에 해당 학생의 종합 텍스트가 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'bbangs$00');
    await page.click('a[href="/write-subject"]');

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL('/write-subject?recordId=972');
    await expect(
      page.locator(
        'text=진로 상담을 통해 자신의 꿈을 구체화하고 있으며, 관련 분야에 대한 탐구 활동을 적극적으로 수행하고 있습니다.',
      ),
    ).toBeVisible();

    await page.click('button:has-text("김민수")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("윤다은")');

    await expect(page).toHaveURL('/write-subject?recordId=975');

    const targetElement = page.locator('text=dddd');
    await targetElement.scrollIntoViewIfNeeded();
    await expect(targetElement).toBeVisible();
  });

  test('5. 로그인하고 write-subject 링크로 들어와서 종합 입력칸에 글을 작성하고 저장 버튼을 누르면 성공적으로 저장되었습니다 라는 모달창이 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'bbangs$00');
    await page.click('a[href="/write-subject"]');

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL('/write-subject?recordId=972');

    const summaryInput = page.locator('textarea[data-testid="summary-input"]');
    await summaryInput.fill(
      '진로 상담을 통해 자신의 꿈을 구체화하고 있으며, 관련 분야에 대한 탐구 활동을 적극적으로 수행하고 있습니다.',
    );
    await page.click('button:has-text("저장")');

    await expect(page.locator('text=성공적으로 저장되었습니다')).toBeVisible();
    await page.click('button:has-text("확인")');
  });

  test('6. 학생 특성을 비워둔 채로 AI 생성 버튼을 누르면 내용을 입력해주세요. 라는 alert 창이 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'bbangs$00');
    await page.click('a[href="/write-subject"]');

    await page.waitForTimeout(3000);

    await expectAlertMessage(page, '내용을 입력해주세요.');

    await page.locator('button:has-text("생성")').click();
  });

  test('7. 생활기록부 종합 작성 창에서 기존 bytes 수보다 크게 입력하면 빨간 글씨로 bytes가 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'bbangs$00');
    await page.click('a[href="/write-subject"]');

    await page.waitForTimeout(3000);

    const summaryInput = page.locator('textarea[data-testid="summary-input"]');

    const longText = '가'.repeat(3000);
    await summaryInput.fill(longText);

    await expect(page.locator('.text-red-600')).toBeVisible();
  });

  // sse 적용되면 작성 기능도 테스트 진행
});

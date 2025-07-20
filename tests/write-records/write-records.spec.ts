import { test, expect } from '@playwright/test';

import {
  performLogin,
  performLogout,
  waitForApiResponse,
  expectAlertMessage,
} from '../utils/test-helpers';

test.describe('생활기록부 작성 E2E 테스트', () => {
  test('1. 로그인이 안되어 있는 상태에서 사이드바의 학교 생활기록부 작성 하위 항목인 세부능력 및 특기사항을 클릭해서 들어가면 로그인이 필요합니다 라는 텍스트가 나온다.', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('a[href="/write-behavior"]');
    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();
  });

  test('2. 이메일 인증하지 않은 유저가 로그인 하고 사이드바의 학교 생활기록부 작성 하위 항목인 행동 특성 및 종합의견을 클릭해서 들어가면 이메일을 인증해주세요 라는 텍스트가 나오고, 로그아웃을 하고 다시 들어가면 로그인이 필요합니다 라는 텍스트가 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'ab12345678');
    await page.goto('/');
    await page.click('a[href="/write-behavior"]');
    await expect(page.locator('text=이메일 인증 후 서비스 이용이 가능합니다.')).toBeVisible();

    await performLogout(page);
    await page.goto('/write-behavior');
    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();
  });

  test('3. 로그인 하고 사이드바의 학교 생활기록부 작성 하위 항목인 행동 특성 및 종합의견을 클릭해서 들어가면 아직 등록된 생활기록부가 없어요 라는 텍스트가 나오고, 로그아웃을 하고 다시 들어가면 로그인이 필요합니다 라는 텍스트가 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/');
    await page.click('a[href="/write-behavior"]');
    await expect(page.locator('text=아직 등록된 생활기록부가 없어요')).toBeVisible();

    await performLogout(page);
    await page.goto('/write-behavior');
    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();
  });

  test('4. 로그인하고 write-behavior 링크로 들어와서 학생 등록하고 생활기록부 관리하기 버튼을 클릭해서 템플릿을 다운로드 하고, 파일 업로드를 클릭해서 해당 템플릿 excel 파일을 올리면 이름 목록이 잘 나오고, 생성하기버튼을 누르면 api 응답이 200으로 잘 내려온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/write-behavior');
    await page.click('button:has-text("생활기록부 관리하기")');

    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("템플릿 다운로드")');
    const download = await downloadPromise;

    const downloadPath = await download.path();

    await page.locator('[data-testid="excel-upload"]').click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(downloadPath);

    await expect(page.locator('text=홍길동')).toBeVisible();
    await expect(page.locator('text=김철수')).toBeVisible();
    await expect(page.locator('text=이영희')).toBeVisible();
    await expect(page.locator('text=업로드된 학생 목록 (3명)')).toBeVisible();

    const apiResponsePromise = waitForApiResponse(
      page,
      '/api/v1/student-records/behavior/students/batch',
      'POST',
    );

    await page.click('button:has-text("3명 생성하기")');
    await apiResponsePromise;
  });

  test('5. 로그인하고 write-career 링크로 들어오면 /write-career?recordId=1으로 리다이렉팅 되고 종합 파트에 학생의 종합 텍스트가 나오고, 이름 드롭다운을 클릭해서 윤다은을 클릭하면 /write-career?recordId=3으로 리다이렉팅 되고, 종합 파트에 해당 학생의 종합 텍스트가 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/write-career');
    await expect(page).toHaveURL('/write-career?recordId=1');
    await expect(
      page.locator(
        'text=진로 상담을 통해 자신의 꿈을 구체화하고 있으며, 관련 분야에 대한 탐구 활동을 적극적으로 수행하고 있습니다.',
      ),
    ).toBeVisible();

    await page.click('button:has-text("김민수")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("윤다은")');

    await expect(page).toHaveURL('/write-career?recordId=3');
    await expect(
      page.locator(
        'text=진로 포트폴리오를 성실히 작성하고 있으며, 미래 계획을 체계적으로 세우고 있습니다.',
      ),
    ).toBeVisible();
  });

  test('6. 로그인하고 write-career 링크로 들어와서 학생 특성 기입란에 텍스트를 입력하고 생성 버튼을 누르면 버전 1,2,3이 5초동안 로딩하는 로딩 ui가 나오고 5초 후에 결과 텍스트가 돌아온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/write-career');
    await expect(page).toHaveURL('/write-career?recordId=1');

    const characteristicInput = page.locator('textarea[placeholder*="내용을 입력해주세요"]');
    await characteristicInput.fill(
      '이 학생은 진로 탐색에 매우 적극적이며 다양한 활동에 참여합니다.',
    );

    await page.click('button:has-text("생성")');
    await expect(page.locator('[data-testid="ai-loading"]')).toHaveCount(3);

    await page.waitForTimeout(6000);

    await expect(
      page.locator('text=이 학생은 진로 탐색에 있어 매우 적극적인 자세를 보이며'),
    ).toBeVisible();
    await expect(
      page.locator('text=창의적 체험활동을 통해 자신의 진로에 대한 명확한 비전을 세우고'),
    ).toBeVisible();
    await expect(page.locator('text=진로와 관련된 활동에 주도적으로 참여하며')).toBeVisible();
  });

  test('7. 로그인하고 write-career 링크로 들어와서 종합 입력칸에 글을 작성하고 저장 버튼을 누르면 성공적으로 저장되었습니다 라는 모달창이 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/write-career');
    await expect(page).toHaveURL('/write-career?recordId=1');

    const summaryInput = page.locator('textarea[data-testid="summary-input"]');
    await summaryInput.fill(
      '이 학생은 진로 활동에서 뛰어난 성과를 보였으며, 지속적인 발전 가능성을 보여줍니다.',
    );
    await page.click('button:has-text("저장")');

    await expect(page.locator('text=성공적으로 저장되었습니다')).toBeVisible();
    await page.click('button:has-text("확인")');
  });

  test('8. 엑셀 업로드 시 잘못된 파일 형식을 업로드하면, 엑셀 파일을 처리하는 중 오류가 발생했습니다. 라는 alert 창이 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/write-behavior');
    await page.click('button:has-text("생활기록부 관리하기")');

    await page.locator('[data-testid="excel-upload"]').click();

    await expectAlertMessage(page, '엑셀 파일을 처리하는 중 오류가 발생했습니다.');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('invalid file content'),
    });
  });

  test('9. 학생 특성을 비워둔 채로 AI 생성 버튼을 누르면 내용을 입력해주세요. 라는 alert 창이 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/write-career');

    await expectAlertMessage(page, '내용을 입력해주세요.');

    await page.locator('button:has-text("생성")').click();
  });

  test('10. 생활기록부 종합 작성 창에서 기존 bytes 수보다 크게 입력하면 빨간 글씨로 bytes가 나온다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/write-career');

    const summaryInput = page.locator('textarea[data-testid="summary-input"]');

    const longText = '가'.repeat(3000);
    await summaryInput.fill(longText);

    await expect(page.locator('.text-red-600')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

import {
  performLogout,
  expectAlertMessage,
  loginAsUser,
  loginAsUnverified,
} from './utils/test-helpers';

test.describe('학생 관리 페이지 E2E 테스트', () => {
  test('1. 로그인이 안되어 있는 상태에서 사이드바의 나의 학생 관리 하위 항목인 세부능력 및 특기사항을 클릭해서 들어가면 로그인이 필요합니다 라는 텍스트가 나오고, 학생 추가/엑셀로 내보내기 버튼이 보이지 않고, 로그인 버튼을 누르면 로그인 페이지로 이동한다.', async ({
    page,
  }) => {
    await page.goto('/');
    await page.click('a[href="/manage-subject"]');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();

    await expect(page.locator('button:has-text("학생 추가")')).not.toBeVisible();
    await expect(page.locator('td:has-text("+ 추가하기")')).not.toBeVisible();
    await expect(page.locator('button:has-text("엑셀로 내보내기")')).not.toBeVisible();

    await page.click('a[href="/login"]:has-text("로그인")');
    await expect(page).toHaveURL('/login');
  });

  test('2. 이메일 인증하지 않은 유저가 로그인 하고 사이드바의 나의 학생 관리 하위 항목인 행동 특성 및 종합의견을 클릭해서 들어가면 이메일을 인증해주세요 라는 텍스트가 나오고, 학생 추가/엑셀로 내보내기 버튼이 보이지 않고, 로그아웃을 하고 다시 들어가면 로그인이 필요합니다 라는 텍스트가 나온다.', async ({
    page,
  }) => {
    await loginAsUnverified(page);
    await page.click('a[href="/manage-behavior"]');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=이메일 인증 후 서비스 이용이 가능합니다.')).toBeVisible();

    await expect(page.locator('button:has-text("학생 추가")')).not.toBeVisible();
    await expect(page.locator('td:has-text("+ 추가하기")')).not.toBeVisible();
    await expect(page.locator('button:has-text("엑셀로 내보내기")')).not.toBeVisible();

    await performLogout(page);
    await page.goto('/manage-behavior');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();
  });

  test('3. 로그인 하고 사이드바의 나의 학생 관리 하위 항목인 창체 - 자율을 클릭해서 들어가면 엑셀로 내보내기 버튼이 disabled 상태이고, 학생 데이터가 0개이며 추가하기 버튼만 나온다.', async ({
    page,
  }) => {
    await loginAsUser(page);
    await page.click('a[href="/manage-free"]');

    await page.waitForTimeout(3000);

    await expect(page.locator('button:has-text("엑셀로 내보내기")')).toBeDisabled();
    await expect(page.locator('table tbody tr')).toHaveCount(1);
    await expect(page.locator('td:has-text("+ 추가하기")')).toBeVisible();
  });

  test('4. 로그인하고 manage-free 링크로 들어와서 학생 등록하고 생활기록부 관리하기 버튼을 클릭해서 템플릿을 다운로드 하고, 파일 업로드를 클릭해서 해당 템플릿 excel 파일을 올리면 이름 목록이 잘 나오고, 생성하기 버튼을 누르면 추가된 데이터가 잘 보인다.', async ({
    page,
  }) => {
    await loginAsUser(page);

    await page.click('a[href="/manage-free"]');

    await page.waitForTimeout(3000);

    await page.click('button:has-text("학생 추가")');

    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("템플릿 다운로드")');
    const download = await downloadPromise;
    const downloadPath = await download.path();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(downloadPath);

    await expect(page.locator('text=홍길동')).toBeVisible();
    await expect(page.locator('text=김철수')).toBeVisible();
    await expect(page.locator('text=이영희')).toBeVisible();
    await expect(page.locator('text=업로드된 학생 목록 (3명)')).toBeVisible();

    await page.click('button:has-text("3명 생성하기")');

    await page.waitForTimeout(3000);

    // 추가한 데이터 정리
    await expect(page.locator('text=홍길동')).toBeVisible();
    await expect(page.locator('text=김철수')).toBeVisible();
    await expect(page.locator('text=이영희')).toBeVisible();

    await page.locator('table tbody tr').first().click();
    await page.click('button:has-text("삭제하기")');
    await expect(page.locator('text=정말 삭제하시겠습니까?')).toBeVisible();
    await page.click('button[data-testid="modal-remove-button"]');

    await page.locator('table tbody tr').first().click();
    await page.click('button:has-text("삭제하기")');
    await expect(page.locator('text=정말 삭제하시겠습니까?')).toBeVisible();
    await page.click('button[data-testid="modal-remove-button"]');

    await page.locator('table tbody tr').first().click();
    await page.click('button:has-text("삭제하기")');
    await expect(page.locator('text=정말 삭제하시겠습니까?')).toBeVisible();
    await page.click('button[data-testid="modal-remove-button"]');
  });

  test('5. 엑셀 업로드 시 잘못된 파일 형식을 업로드하면, 엑셀 파일을 처리하는 중 오류가 발생했습니다. 라는 alert 창이 나온다.', async ({
    page,
  }) => {
    await loginAsUser(page);

    await page.click('a[href="/manage-free"]');

    await page.waitForTimeout(3000);

    await page.click('button:has-text("학생 추가")');

    await expectAlertMessage(page, '엑셀 파일을 처리하는 중 오류가 발생했습니다.');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('invalid file content'),
    });
  });

  test('6. 추가하기 버튼을 눌러서 학번, 이름, 내용을 채워넣고 추가하고, 수정하고, 삭제하는 로직이 정상적으로 수행되고 UI가 상황에 맞게 바뀐다', async ({
    page,
  }) => {
    await loginAsUser(page);

    await page.click('a[href="/manage-career"]');

    await page.click('td:has-text("+ 추가하기")');

    await page.fill('input[data-testid="student-number-input"]', '2024001');
    await page.fill('input[data-testid="student-name-input"]', '테스트학생');
    await page.fill(
      'textarea[data-testid="description-textarea"]',
      '성실하고 적극적인 학생입니다.',
    );

    await page.click('button:has-text("추가하기")');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=테스트학생')).toBeVisible();

    await page.locator('table tbody tr').first().click();

    const nameInput = page.locator('input[data-testid="student-name-input"]');
    await nameInput.clear();
    await nameInput.fill('수정된이름');

    await page.click('button:has-text("수정하기")');

    await page.waitForTimeout(3000);

    await expect(page.locator('text=수정된이름')).toBeVisible();

    await page.locator('table tbody tr').first().click();

    await page.click('button:has-text("삭제하기")');
    await expect(page.locator('text=정말 삭제하시겠습니까?')).toBeVisible();
    await page.click('button[data-testid="modal-remove-button"]');

    await page.waitForTimeout(3000);

    await expect(page.locator('button:has-text("엑셀로 내보내기")')).toBeDisabled();
    await expect(page.locator('table tbody tr')).toHaveCount(1);
  });

  test('7. 로그인하고, 세부 능력 및 특기사항에서 table 맨 위의 row를 클릭해서 취소하기 버튼을 누르면 아무 일도 일어나지 않는다.', async ({
    page,
  }) => {
    await loginAsUser(page);

    await page.click('a[href="/manage-subject"]');

    await page.waitForTimeout(3000);

    await page.locator('table tbody tr').first().click();

    const inputField = page.locator('input[data-testid="student-name-input"]');
    await expect(inputField).toBeVisible();

    await page.click('button:has-text("취소하기")');

    await expect(inputField).not.toBeVisible();
  });

  test('8. 엑셀로 내보내기 버튼을 누르면 현재 있는 data가 엑셀로 추출되어서 다운로드 받아진다.', async ({
    page,
  }) => {
    await loginAsUser(page);

    await page.click('a[href="/manage-subject"]');

    await page.waitForTimeout(3000);

    const exportButton = page.locator('button:has-text("엑셀로 내보내기")');
    await expect(exportButton).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    expect(download).toBeTruthy();

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    const fileName = download.suggestedFilename();
    if (fileName && fileName !== 'download') {
      expect(fileName).toContain('.xlsx');
      expect(fileName).toContain('세부능력 및 특기사항');
    }
  });
});

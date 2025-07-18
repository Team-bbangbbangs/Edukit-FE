import { test, expect } from '@playwright/test';

import { performLogin, expectAlertMessage, waitForApiResponse } from '../utils/test-helpers';

test.describe('프로필 관리 E2E 테스트', () => {
  test('1. 로그인 안한 상태에서 /mypage로 접근하면 로그인 후 접근 가능합니다 라는 글씨가 뜨고, 로그인을 하면 profile이 정상적으로 나온다', async ({
    page,
  }) => {
    await page.goto('/mypage');
    await page.waitForTimeout(10000);

    await expect(page.locator('text=로그인 후 접근 가능합니다.')).toBeVisible();
    await expect(page.locator('a[href="/login"]:has-text("로그인하기")')).toBeVisible();

    await page.click('a[href="/login"]:has-text("로그인하기")');
    await expect(page).toHaveURL('/login');

    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/mypage');

    await expect(page.locator('h2:has-text("내 프로필")')).toBeVisible();
    await expect(page.locator('text=이승섭')).toBeVisible();
    await expect(page.locator('text=수학')).toBeVisible();
    await expect(page.locator('text=중학교')).toBeVisible();
  });

  test('2. 프로필 수정 - 닉네임 유효성 검사 및 금칙어, 중복 확인 검사를 통해 각 상황에 맞는 UI가 나오고, 정상적인 닉네임을 입력하고 저장하기 버튼을 누르면 API 응답이 200으로 정상적으로 내려온다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/mypage');

    await page.click('button:has-text("수정")');

    await expect(page.locator('input[placeholder="닉네임을 입력하세요"]')).toBeVisible();
    await expect(page.locator('button:has-text("중복 확인")')).toBeVisible();

    // 닉네임 빈칸으로 입력
    const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
    await nicknameInput.clear();
    await expect(page.locator('button:has-text("저장")')).toBeDisabled();
    await expect(page.locator('button:has-text("중복 확인")')).toBeDisabled();

    // 금칙어 닉네임 입력
    await nicknameInput.fill('ㅇㅇ');
    await expect(page.locator('button:has-text("중복 확인")')).toBeEnabled();
    expectAlertMessage(page, '금칙어가 들어갔습니다. 다른 닉네임을 사용해주세요.');
    await page.click('button:has-text("중복 확인")');
    await page.waitForTimeout(500);

    // 중복된 닉네임 입력
    await nicknameInput.clear();
    await nicknameInput.fill('선생님1');
    expectAlertMessage(page, '현재 사용 중인 닉네임입니다.');
    await page.click('button:has-text("중복 확인")');
    await page.waitForTimeout(500);

    // 정상적인 닉네임 입력
    await nicknameInput.clear();
    await nicknameInput.fill('선생님123');
    expectAlertMessage(page, '사용 가능한 닉네임입니다!');
    await page.click('button:has-text("중복 확인")');
    await page.waitForTimeout(500);
    await expect(page.locator('button:has-text("저장")')).toBeEnabled();
    const apiResponsePromise = waitForApiResponse(page, '/api/v1/users/profile', 'PATCH');
    await page.click('button:has-text("저장")');
    await apiResponsePromise;
  });

  test('3. 프로필 수정 - 과목과 학교를 변경하고 저장하기 버튼을 누르면 API 응답이 200으로 정상적으로 내려온다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/mypage');

    await page.click('button:has-text("수정")');

    await page.click('button:has-text("수학")');
    await page.click('button:has-text("국어")');
    await page.click('button:has-text("고등학교")');
    const apiResponsePromise = waitForApiResponse(page, '/api/v1/users/profile', 'PATCH');
    await page.click('button:has-text("저장")');
    await apiResponsePromise;
  });

  test('4. 교사 인증 필요가 마이페이지에 나와있을 때 클릭하면 이메일이 발송되었다는 모달창이 정상적으로 나온다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/mypage');

    const certificationStatus = page.locator('span.text-red-500:has-text("교사 인증 필요")');
    await expect(certificationStatus).toBeVisible();

    await certificationStatus.click();

    await expect(page.locator('text=이메일이 발송되었습니다')).toBeVisible();
    await page.click('button:has-text("확인")');
  });

  test('5. 이메일 수정 - 이메일 유효성 검사, 중복 확인 검사를 통해 각 상황에 맞는 UI가 나오고, 정상적인 이메일을 입력하고 저장하기 버튼을 누르면 API 응답이 200으로 정상적으로 내려온다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/mypage');
    await page.locator('[data-testid="email-edit-button"]').click();

    const emailInput = page.locator('input[type="email"]');

    await expect(emailInput).toHaveValue('youngryu10@gmail.com');

    // 이메일 빈칸으로 입력
    await emailInput.clear();
    await page.click('button:has-text("저장")');
    await expect(page.locator('text=이메일을 입력해주세요.')).toBeVisible();

    // 이메일 형식이 아닌 값 입력
    await emailInput.fill('invalid-email');
    await page.click('button:has-text("저장")');
    await expect(page.locator('text=이메일 형식이 유효하지 않습니다.')).toBeVisible();

    // 교직용 이메일이 아닌 이메일 입력
    await emailInput.clear();
    await emailInput.fill('test@daum.net');
    await page.click('button:has-text("저장")');
    await expect(page.locator('text=교직 이메일이 아닙니다.')).toBeVisible();

    // 중복된 이메일 입력
    await emailInput.clear();
    await emailInput.fill('test@edukit.co.kr');
    expectAlertMessage(page, '이미 등록된 회원입니다.');
    await page.click('button:has-text("저장")');
    await page.waitForTimeout(500);

    // 정상적인 이메일 입력
    await emailInput.clear();
    await emailInput.fill('test123123@edukit.co.kr');
    expectAlertMessage(page, '이메일이 성공적으로 변경되었습니다.');
    const apiResponsePromise = waitForApiResponse(page, '/api/v1/users/email', 'PATCH');
    await page.click('button:has-text("저장")');
    await apiResponsePromise;
  });

  test('6. 비밀번호 수정 - 유효성 검사 및 변경', async ({ page }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.goto('/mypage');
    await page.locator('[data-testid="password-edit-button"]').click();

    await expect(page.locator('input[placeholder="현재 비밀번호"]')).toBeVisible();
    await expect(page.locator('input[placeholder="새 비밀번호"]')).toBeVisible();
    await expect(page.locator('input[placeholder="새 비밀번호 확인"]')).toBeVisible();

    // 3개의 빈칸 상태일떄 저장 버튼 누르기
    await page.click('button:has-text("저장")');
    await expect(page.locator('[data-testid="current-password-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="new-password-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password-error"]')).toBeVisible();

    // 새 비밀번호에 유효하지 않은 값 입력
    await page.fill('input[placeholder="현재 비밀번호"]', 'password123!');
    await page.fill('input[placeholder="새 비밀번호"]', '123');
    await page.click('button:has-text("저장")');
    await expect(page.locator('text=비밀번호는 최소 8자 이상이어야 합니다.')).toBeVisible();

    // 새 비밀번호 확인에 다른 값 입력
    await page.fill('input[placeholder="새 비밀번호"]', 'newPassword123!');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'differentPassword');
    await page.click('button:has-text("저장")');
    await expect(page.locator('text=새 비밀번호가 일치하지 않습니다.')).toBeVisible();

    // 기존 비밀번호와 같은 값 입력
    await page.fill('input[placeholder="새 비밀번호"]', 'password123!');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'password123!');
    expectAlertMessage(page, '새로운 비밀번호는 기존 비밀번호와 같을 수 없습니다.');
    await page.click('button:has-text("저장")');
    await page.waitForTimeout(500);

    // 현재 비밀번호가 틀린 경우
    await page.fill('input[placeholder="현재 비밀번호"]', 'password1234');
    await page.fill('input[placeholder="새 비밀번호"]', 'password1234!');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'password1234!');
    expectAlertMessage(page, '현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
    await page.click('button:has-text("저장")');
    await page.waitForTimeout(500);

    // 정상적인 비밀번호 변경
    await page.fill('input[placeholder="현재 비밀번호"]', 'password123!');
    await page.fill('input[placeholder="새 비밀번호"]', 'password1234');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'password1234');

    expectAlertMessage(page, '비밀번호가 성공적으로 변경되었습니다.');
    await page.click('button:has-text("저장")');
    await page.waitForTimeout(500);
  });
});

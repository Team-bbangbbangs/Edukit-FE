import { test, expect } from '@playwright/test';

import {
  isLoggedIn,
  expectAlertMessage,
  performLogout,
  loginAsUser,
  getUserEmail,
} from './utils/test-helpers';

test.describe('인증 기능 E2E 테스트', () => {
  test('1. 로그인 안되어있는 상태에는 헤더에 로그인 버튼이 떠있고, 로그인 버튼을 누르면 로그인 페이지로 이동한다', async ({
    page,
  }) => {
    await page.goto('/');

    expect(await isLoggedIn(page)).toBe(false);

    const loginButton = page.locator('header a[href="/login"]');
    await expect(loginButton).toBeVisible();

    await loginButton.click();

    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('img', { name: 'Edukit' })).toBeVisible();
  });

  test('2. 로그인할 때 이메일 형식이 안맞거나, 교직용 이메일이 아닐때, 비밀번호 형식이 맞지 않을때 로그인 버튼을 누르면 error.message가 빨갛게 나오고 api요청이 안간다', async ({
    page,
  }) => {
    await page.goto('/login');

    const apiRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/v1/auth/login')) {
        apiRequests.push(request.url());
      }
    });

    await page.fill('input[placeholder="이메일"]', 'invalid-email');
    await page.fill('input[placeholder="비밀번호"]', 'ab12341234!');
    await page.click('button[type="submit"]:has-text("로그인")');

    const emailFormatError = page
      .locator('p.text-red-500')
      .filter({ hasText: '이메일 형식이 올바르지 않습니다.' });
    await expect(emailFormatError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input[placeholder="이메일"]', 'test@daum.com');
    await page.fill('input[placeholder="비밀번호"]', 'ab12341234!');
    await page.click('button[type="submit"]:has-text("로그인")');

    const teacherEmailError = page
      .locator('p.text-red-500')
      .filter({ hasText: '유효하지 않은 교사 이메일입니다. 교육청 이메일 도메인만 허용됩니다.' });
    await expect(teacherEmailError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    const email = getUserEmail();

    await page.fill('input[placeholder="이메일"]', email);
    await page.fill('input[placeholder="비밀번호"]', '123');
    await page.click('button[type="submit"]:has-text("로그인")');

    const passwordLengthError = page
      .locator('p.text-red-500')
      .filter({ hasText: '비밀번호는 최소 8자 이상이어야 합니다.' });
    await expect(passwordLengthError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input[placeholder="이메일"]', email);
    await page.fill('input[placeholder="비밀번호"]', 'aaaaaaaa');
    await page.click('button[type="submit"]:has-text("로그인")');

    const passwordComplexityError = page
      .locator('p.text-red-500')
      .filter({ hasText: '영문/숫자/특수문자 중 2가지 이상 포함해야 합니다.' });
    await expect(passwordComplexityError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input[placeholder="이메일"]', email);
    await page.fill('input[placeholder="비밀번호"]', 'ab12312312333');
    await page.click('button[type="submit"]:has-text("로그인")');

    const passwordSamewordError = page
      .locator('p.text-red-500')
      .filter({ hasText: '동일 문자를 3번 연속으로 사용할 수 없습니다.' });
    await expect(passwordSamewordError).toBeVisible();
    expect(apiRequests.length).toBe(0);
  });

  test('3. 로그인할 때 이메일이 없거나 비밀번호가 틀릴때 error.message가 빨갛게 나온다', async ({
    page,
  }) => {
    await page.goto('/login');

    const email = getUserEmail();

    await page.fill('input[placeholder="이메일"]', email);
    await page.fill('input[placeholder="비밀번호"]', 'abcd1234');
    await page.click('button[type="submit"]:has-text("로그인")');

    await page.waitForSelector('p.text-red-500', { timeout: 5000 });
    const passwordError = page
      .locator('p.text-red-500')
      .filter({ hasText: '비밀번호가 올바르지 않습니다.' });
    await expect(passwordError).toBeVisible();

    await page.fill('input[placeholder="이메일"]', '123@edukit.co.kr');
    await page.fill('input[placeholder="비밀번호"]', 'abcd1234');
    await page.click('button[type="submit"]:has-text("로그인")');

    await page.waitForSelector('p.text-red-500', { timeout: 5000 });
    const notFoundError = page
      .locator('p.text-red-500')
      .filter({ hasText: '존재하지 않는 회원입니다. 회원가입을 진행해주세요.' });
    await expect(notFoundError).toBeVisible();
  });

  test('4. 로그인 성공하면 랜딩페이지로 이동하고, 헤더에 프로필 이미지가 나온다', async ({
    page,
  }) => {
    await loginAsUser(page);

    await expect(page).toHaveURL('/');

    await expect(page.locator('header img[alt="profile image"]')).toBeVisible();

    const loginButton = page.locator('header a[href="/login"]');
    await expect(loginButton).not.toBeVisible();
  });

  test('5. 회원가입 페이지에서 유효성 검사 실패 시 error.message가 빨갛게 나오고 api요청이 안간다', async ({
    page,
  }) => {
    await page.goto('/signup');

    await page.fill('input#email', 'test');
    await page.fill('input#password', 'ab12341234!');
    await page.fill('input#confirmPassword', 'ab12341234!');

    const emailFormatError = page
      .locator('p.text-red-500')
      .filter({ hasText: '이메일 형식이 올바르지 않습니다.' });
    await expect(emailFormatError).toBeVisible();

    await page.reload();

    await page.fill('input#email', 'test@daum.net');
    await page.fill('input#password', 'ab12341234!');
    await page.fill('input#confirmPassword', 'ab12341234!');

    const teacherEmailError = page
      .locator('p.text-red-500')
      .filter({ hasText: '유효하지 않은 교사 이메일입니다. 교육청 이메일 도메인만 허용됩니다.' });
    await expect(teacherEmailError).toBeVisible();

    await page.reload();

    const email = getUserEmail();

    await page.fill('input#email', email);
    await page.fill('input#password', '123');
    await page.fill('input#confirmPassword', '123');

    const passwordLengthError = page
      .locator('p.text-red-500')
      .filter({ hasText: '비밀번호는 최소 8자 이상이어야 합니다.' });
    await expect(passwordLengthError).toBeVisible();

    await page.reload();

    await page.fill('input#email', email);
    await page.fill('input#password', 'ab12341234');
    await page.fill('input#confirmPassword', 'ab12341234!');

    const passwordMismatchError = page
      .locator('p.text-red-500')
      .filter({ hasText: '비밀번호가 일치하지 않습니다.' });
    await expect(passwordMismatchError).toBeVisible();
  });

  test.describe('회원가입 닉네임 중복 검증 테스트', () => {
    test('닉네임을 입력하면 중복 확인이 필요하다는 메시지가 표시된다', async ({ page }) => {
      await page.goto('/signup');

      await page.fill('input#nickname', 'testnickname');

      await expect(
        page.locator('p.text-orange-500:has-text("닉네임 중복 확인을 해주세요.")'),
      ).toBeVisible();
      await expect(page.locator('input#nickname')).toHaveClass(/border-orange-500/);
    });

    test('닉네임이 비어있으면 중복 확인 버튼이 비활성화된다', async ({ page }) => {
      await page.goto('/signup');

      const checkButton = page.locator('button:has-text("중복 확인")');
      await expect(checkButton).toBeDisabled();

      await page.fill('input#nickname', 'testnickname');
      await expect(checkButton).toBeEnabled();
    });

    test('닉네임 중복 확인에 성공하면 사용 가능하다는 메시지가 표시된다', async ({ page }) => {
      await page.goto('/signup');

      const nicknameInput = page.locator('input#nickname');
      const checkButton = page.locator('button:has-text("중복 확인")');

      await nicknameInput.fill('testnickname');
      await checkButton.click();

      await expect(
        page.locator('p.text-green-500:has-text("사용하실 수 있는 닉네임입니다!")'),
      ).toBeVisible();
    });

    test('금칙어가 포함된 닉네임에 대해 에러 메시지가 표시된다', async ({ page }) => {
      await page.goto('/signup');

      await expectAlertMessage(page, '입력하신 닉네임은 유효하지 않습니다.');

      await page.fill('input#nickname', 'ㅇㅇ');
      await page.click('button:has-text("중복 확인")');

      await expect(page.locator('p.text-red-500')).toBeVisible();
      await expect(page.locator('input#nickname')).toHaveClass(/border-red-500/);
    });

    test('중복된 닉네임에 대해 에러 메시지가 표시된다', async ({ page }) => {
      await page.goto('/signup');

      await expectAlertMessage(page, '입력하신 닉네임은 중복된 닉네임입니다.');

      await page.fill('input#nickname', '선생님1');
      await page.click('button:has-text("중복 확인")');

      await expect(page.locator('p.text-red-500')).toBeVisible();
      await expect(page.locator('input#nickname')).toHaveClass(/border-red-500/);
    });

    test('닉네임을 변경하면 중복 확인 상태가 초기화된다', async ({ page }) => {
      await page.goto('/signup');

      const nicknameInput = page.locator('input#nickname');
      const checkButton = page.locator('button:has-text("중복 확인")');

      await nicknameInput.fill('testnickname');
      await checkButton.click();

      await expect(
        page.locator('p.text-green-500:has-text("사용하실 수 있는 닉네임입니다!")'),
      ).toBeVisible();

      await nicknameInput.clear();
      await nicknameInput.fill('newnickname');

      await expect(
        page.locator('p.text-orange-500:has-text("닉네임 중복 확인을 해주세요.")'),
      ).toBeVisible();
      await expect(
        page.locator('p.text-green-500:has-text("사용하실 수 있는 닉네임입니다!")'),
      ).not.toBeVisible();
    });
  });

  test('7. verify-email 페이지에 id === "test@naver.com" && code === "abc" 아닐때 이메일 인증에 실패했습니다. 가 나온다', async ({
    page,
  }) => {
    await page.goto('/verify-email?id=test@naver.com&code=wrong');
    await expect(page.locator('h1:has-text("이메일 인증에 실패했습니다.")')).toBeVisible();
    await expect(page.locator('text=다시 인증해주세요.')).toBeVisible();

    await page.goto('/verify-email?id=wrong@email.com&code=abc');
    await expect(page.locator('h1:has-text("이메일 인증에 실패했습니다.")')).toBeVisible();
    await expect(page.locator('text=다시 인증해주세요.')).toBeVisible();
  });

  test('8. 로그인상태에서 로그아웃 버튼을 누르면 헤더의 프로필 이미지에서 로그인 버튼으로 바뀐다', async ({
    page,
  }) => {
    await loginAsUser(page);
    await expect(page.locator('header img[alt="profile image"]')).toBeVisible();
    expect(await isLoggedIn(page)).toBe(true);

    await performLogout(page);

    const loginButton = page.locator('header a[href="/login"]');
    await expect(loginButton).toBeVisible();
    expect(await isLoggedIn(page)).toBe(false);
  });
});

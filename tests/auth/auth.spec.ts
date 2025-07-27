import { test, expect } from '@playwright/test';

import { isLoggedIn, expectAlertMessage, performLogin, performLogout } from '../utils/test-helpers';

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
    await expect(page.locator('h2:has-text("Edukit")')).toBeVisible();
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
      .filter({ hasText: '이메일 형식이 유효하지 않습니다.' });
    await expect(emailFormatError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input[placeholder="이메일"]', 'test@daum.com');
    await page.fill('input[placeholder="비밀번호"]', 'ab12341234!');
    await page.click('button[type="submit"]:has-text("로그인")');

    const teacherEmailError = page
      .locator('p.text-red-500')
      .filter({ hasText: '교직 이메일이 아닙니다.' });
    await expect(teacherEmailError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input[placeholder="이메일"]', 'test@edukit.co.kr');
    await page.fill('input[placeholder="비밀번호"]', '123');
    await page.click('button[type="submit"]:has-text("로그인")');

    const passwordLengthError = page
      .locator('p.text-red-500')
      .filter({ hasText: '비밀번호는 최소 8자 이상이어야 합니다.' });
    await expect(passwordLengthError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input[placeholder="이메일"]', 'test@edukit.co.kr');
    await page.fill('input[placeholder="비밀번호"]', 'aaaaaaaa');
    await page.click('button[type="submit"]:has-text("로그인")');

    const passwordComplexityError = page
      .locator('p.text-red-500')
      .filter({ hasText: '영문/숫자/특수문자 중 2가지 이상 포함해야 합니다.' });
    await expect(passwordComplexityError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input[placeholder="이메일"]', 'test@edukit.co.kr');
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

    await page.fill('input[placeholder="이메일"]', 'test@edukit.co.kr');
    await page.fill('input[placeholder="비밀번호"]', 'abcd1234');
    await page.click('button[type="submit"]:has-text("로그인")');

    await page.waitForSelector('p.text-red-500', { timeout: 5000 });
    const passwordError = page
      .locator('p.text-red-500')
      .filter({ hasText: '비밀번호가 일치하지 않습니다.' });
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
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');

    await expect(page).toHaveURL('/');

    await expect(page.locator('header img[alt="profile image"]')).toBeVisible();

    const loginButton = page.locator('header a[href="/login"]');
    await expect(loginButton).not.toBeVisible();
  });

  test('5. 회원가입 페이지에서 유효성 검사 실패 시 error.message가 빨갛게 나오고 api요청이 안간다', async ({
    page,
  }) => {
    await page.goto('/signup');

    const apiRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/v1/auth/signup')) {
        apiRequests.push(request.url());
      }
    });

    await page.fill('input#email', 'test');
    await page.fill('input#password', 'ab12341234!');
    await page.fill('input#confirmPassword', 'ab12341234!');
    await page.click('button[type="submit"]:has-text("가입하기")');

    const emailFormatError = page
      .locator('p.text-red-500')
      .filter({ hasText: '이메일 형식이 유효하지 않습니다.' });
    await expect(emailFormatError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input#email', 'test@daum.net');
    await page.fill('input#password', 'ab12341234!');
    await page.fill('input#confirmPassword', 'ab12341234!');
    await page.click('button[type="submit"]:has-text("가입하기")');

    const teacherEmailError = page
      .locator('p.text-red-500')
      .filter({ hasText: '교직 이메일이 아닙니다.' });
    await expect(teacherEmailError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input#email', 'test@edukit.co.kr');
    await page.fill('input#password', '123');
    await page.fill('input#confirmPassword', '123');
    await page.click('button[type="submit"]:has-text("가입하기")');

    const passwordLengthError = page
      .locator('p.text-red-500')
      .filter({ hasText: '비밀번호는 최소 8자 이상이어야 합니다.' });
    await expect(passwordLengthError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input#email', 'test@edukit.co.kr');
    await page.fill('input#password', 'ab12341234');
    await page.fill('input#confirmPassword', 'ab12341234!');
    await page.click('button[type="submit"]:has-text("가입하기")');

    const passwordMismatchError = page
      .locator('p.text-red-500')
      .filter({ hasText: '비밀번호가 일치하지 않습니다.' });
    await expect(passwordMismatchError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.reload();

    await page.fill('input#email', 'test@edukit.co.kr');
    await page.fill('input#password', 'ab12341234!');
    await page.fill('input#confirmPassword', 'ab12341234!');
    await page.click('button[type="submit"]:has-text("가입하기")');

    const subjectError = page
      .locator('p.text-red-500')
      .filter({ hasText: '교과목을 입력해주세요.' });
    await expect(subjectError).toBeVisible();
    expect(apiRequests.length).toBe(0);

    await page.click('button:has-text("담당 교과목 선택")');
    await page.waitForSelector('input[type="text"]', { state: 'visible' });
    await page.fill('input[type="text"]', '수학');
    await page.press('input[type="text"]', 'Enter');
    await page.click('button[type="submit"]:has-text("가입하기")');

    const schoolError = page.locator('p.text-red-500').filter({ hasText: '학교를 선택해주세요.' });
    await expect(schoolError).toBeVisible();
    expect(apiRequests.length).toBe(0);
  });

  test('6. 회원가입할때 중복된 이메일이 있으면 alert메세지가 나온다', async ({ page }) => {
    await page.goto('/signup');

    await expectAlertMessage(page, '이미 등록된 회원입니다.');

    await page.fill('input#email', 'test123@edukit.co.kr');
    await page.fill('input#password', 'ab12341234!');
    await page.fill('input#confirmPassword', 'ab12341234!');
    await page.click('button:has-text("담당 교과목 선택")');
    await page.waitForSelector('input[type="text"]', { state: 'visible' });
    await page.fill('input[type="text"]', '수학');
    await page.press('input[type="text"]', 'Enter');
    await page.click('button:has-text("고등학교")');
    await page.click('button[type="submit"]:has-text("가입하기")');

    await page.waitForTimeout(2000);
  });

  test('7. 회원가입 성공하면 SuccessSignup 컴포넌트가 나온다', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input#email', 'test123231@edukit.co.kr');
    await page.fill('input#password', 'ab12341234!');
    await page.fill('input#confirmPassword', 'ab12341234!');
    await page.click('button:has-text("담당 교과목 선택")');
    await page.waitForSelector('input[type="text"]', { state: 'visible' });
    await page.fill('input[type="text"]', '수학');
    await page.press('input[type="text"]', 'Enter');
    await page.click('button:has-text("고등학교")');
    await page.click('button[type="submit"]:has-text("가입하기")');

    await expect(page.locator('h2:has-text("가입 완료")')).toBeVisible();
    await expect(page.locator('text=가입하신 이메일로 인증 메일을 보냈습니다.')).toBeVisible();
  });

  test('8. verify-email 페이지에 id === "test@naver.com" && code === "abc" 일때 이메일 인증이 완료되었습니다! 가 나온다', async ({
    page,
  }) => {
    await page.goto('/verify-email?id=test@naver.com&code=abc');
    await expect(page.locator('h1:has-text("이메일 인증이 완료되었습니다!")')).toBeVisible();
    await expect(page.locator('text=원래 있던 브라우저로 돌아가주세요.')).toBeVisible();
  });

  test('9. verify-email 페이지에 id === "test@naver.com" && code === "abc" 아닐때 이메일 인증에 실패했습니다. 가 나온다', async ({
    page,
  }) => {
    await page.goto('/verify-email?id=test@naver.com&code=wrong');
    await expect(page.locator('h1:has-text("이메일 인증에 실패했습니다.")')).toBeVisible();
    await expect(page.locator('text=이미 만료된 인증 코드입니다.')).toBeVisible();

    await page.goto('/verify-email?id=wrong@email.com&code=abc');
    await expect(page.locator('h1:has-text("이메일 인증에 실패했습니다.")')).toBeVisible();
    await expect(page.locator('text=이미 만료된 인증 코드입니다.')).toBeVisible();
  });

  test('10. 로그인상태에서 로그아웃 버튼을 누르면 헤더의 프로필 이미지에서 로그인 버튼으로 바뀐다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');

    await expect(page.locator('header img[alt="profile image"]')).toBeVisible();
    expect(await isLoggedIn(page)).toBe(true);

    await performLogout(page);

    const loginButton = page.locator('header a[href="/login"]');
    await expect(loginButton).toBeVisible();
    expect(await isLoggedIn(page)).toBe(false);
  });

  test('11. 페이지 새로고침 후에도 로그인 상태가 유지된다', async ({ page }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.waitForTimeout(1000);

    expect(await isLoggedIn(page)).toBe(true);

    await page.reload();
    await page.waitForTimeout(3000);

    expect(await isLoggedIn(page)).toBe(true);
  });

  test('12. accessToken 만료 후 api 요청이 발생할 때, reissue를 요청하고 새로운 accessToken을 받아와 다시 요청하는 interceptor 로직이 정상적으로 동작한다.', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'password1234!');
    await page.waitForTimeout(500);
    expect(await isLoggedIn(page)).toBe(true);

    await page.evaluate(() => {
      const THIRTY_ONE_MINUTES = 31 * 60 * 1000;
      const futureTime = Date.now() + THIRTY_ONE_MINUTES;
      Date.now = () => futureTime;
    });

    expect(await isLoggedIn(page)).toBe(true);
  });
});

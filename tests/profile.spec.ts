import { test, expect } from '@playwright/test';

import { performLogin, expectAlertMessage } from './utils/test-helpers';

test.describe('프로필 관리 E2E 테스트', () => {
  test('1. 로그인 안한 상태에서 /mypage로 접근하면 로그인 후 접근 가능합니다 라는 글씨가 뜨고, 로그인을 하면 profile이 정상적으로 나온다', async ({
    page,
  }) => {
    await page.goto('/mypage');

    await page.waitForTimeout(20000);
    await expect(page.locator('text=로그인 후 접근 가능합니다.')).toBeVisible();
    await expect(page.locator('a[href="/login"]:has-text("로그인하기")')).toBeVisible();

    await page.click('a[href="/login"]:has-text("로그인하기")');
    await expect(page).toHaveURL('/login');

    await page.fill('input[placeholder="이메일"]', 'test@edukit.co.kr');
    await page.fill('input[placeholder="비밀번호"]', 'bbangs$00');

    await page.click('button[type="submit"]:has-text("로그인")');

    await page.waitForTimeout(1000);

    await page.click('header img[alt="profile image"]');
    await page.click('a[href="/mypage"]');

    await expect(page.locator('h2:has-text("내 프로필")')).toBeVisible();
  });

  test('2. 교사 인증 필요가 마이페이지에 나와있을 때 클릭하면 이메일이 발송되었다는 모달창이 정상적으로 나온다', async ({
    page,
  }) => {
    await performLogin(page, 'test123@edukit.co.kr', 'ab12345678');

    await page.click('header img[alt="profile image"]');
    await page.click('a[href="/mypage"]');

    const certificationStatus = page.locator('span.text-red-500:has-text("교사 인증 필요")');
    await expect(certificationStatus).toBeVisible();

    await certificationStatus.click();

    await expect(page.locator('text=이메일이 발송되었습니다')).toBeVisible();
    await page.click('button:has-text("확인")');
  });

  test('3. 프로필 수정 - 닉네임 유효성 검사 및 금칙어, 중복 확인 검사를 통해 각 상황에 맞는 UI가 나오고, 정상적인 닉네임을 입력하고 저장하기 버튼을 누르면 해당 기능이 UI로 잘 반영된다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'bbangs$00');

    await page.click('header img[alt="profile image"]');
    await page.click('a[href="/mypage"]');

    await page.click('button:has-text("프로필 수정하기")');

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

    await page.waitForTimeout(3000);

    // 중복된 닉네임 입력
    await nicknameInput.clear();
    await nicknameInput.fill('선생님1');
    expectAlertMessage(page, '현재 사용 중인 닉네임입니다.');
    await page.click('button:has-text("중복 확인")');

    await page.waitForTimeout(3000);

    // 정상적인 닉네임 입력 - 100부터 100000까지의 난수 사용
    const randomNumber = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
    const testNickname = `선생님${randomNumber}`;

    await nicknameInput.clear();
    await nicknameInput.fill(testNickname);
    expectAlertMessage(page, '사용 가능한 닉네임입니다!');
    await page.click('button:has-text("중복 확인")');
    await expect(page.locator('button:has-text("저장")')).toBeEnabled();

    await page.click('button:has-text("저장")');

    await page.waitForTimeout(3000);

    // 저장 후 프로필 페이지로 돌아가서 닉네임이 실제로 변경되었는지 확인
    await expect(page.locator('h2:has-text("내 프로필")')).toBeVisible();

    // 변경된 닉네임이 화면에 표시되는지 확인
    await expect(page.locator(`text=${testNickname}`)).toBeVisible();

    // 다시 수정 컴포넌트로 들어가서 입력 필드에도 새 닉네임이 반영되었는지 확인
    await page.click('button:has-text("프로필 수정하기")');
    const updatedNicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
    await expect(updatedNicknameInput).toHaveValue(testNickname);
  });

  test('4. 프로필 수정 - 과목과 학교를 변경하고 저장하기 버튼을 누르면 API 응답이 200으로 정상적으로 내려온다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'bbangs$00');

    await page.click('header img[alt="profile image"]');
    await page.click('a[href="/mypage"]');

    // 현재 프로필 정보 확인 (변경 전 상태)
    // ProfileView에서 "과목 : " 다음에 오는 텍스트 추출
    const currentSubjectLocator = page.locator('span:has-text("과목 : ")').locator('+ span');
    const currentSubject = await currentSubjectLocator.textContent();

    // 현재 선택된 학교 확인 (bg-slate-800 클래스를 가진 버튼)
    const currentSchoolButton = page.locator('div.bg-slate-800.text-white span').first();
    const currentSchool = await currentSchoolButton.textContent();

    await page.click('button:has-text("프로필 수정하기")');

    await page.waitForTimeout(1000);

    // 과목 변경
    const subjectDropdownTrigger = page
      .locator('button')
      .filter({ hasText: currentSubject || '과목을 선택하세요' });
    await subjectDropdownTrigger.click();

    await page.waitForTimeout(1000);

    // 현재 선택된 과목과 다른 과목 선택
    let newSubject = '';
    if (currentSubject === '국어') {
      // 국어이면 수학으로 변경
      const mathOption = page.locator('button').filter({ hasText: '수학' });
      await mathOption.click();
      newSubject = '수학';
    } else {
      // 국어가 아니면 국어로 변경
      const koreanOption = page.locator('button').filter({ hasText: '국어' });
      await koreanOption.click();
      newSubject = '국어';
    }
    await page.waitForTimeout(1000);

    // 학교 변경
    let newSchoolText = '';

    if (currentSchool?.includes('중학교')) {
      // 중학교 → 고등학교로 변경
      const highSchoolButton = page.locator('button').filter({ hasText: '고등학교' });
      await highSchoolButton.click();
      newSchoolText = '고등학교';
    } else {
      // 고등학교 → 중학교로 변경 (또는 기본값이 고등학교인 경우)
      const middleSchoolButton = page.locator('button').filter({ hasText: '중학교' });
      await middleSchoolButton.click();
      newSchoolText = '중학교';
    }

    await page.click('button:has-text("저장")');

    await page.waitForTimeout(3000);

    // 변경사항 UI 반영 확인
    await expect(page.locator('button:has-text("프로필 수정하기")')).toBeVisible();

    // 변경된 과목이 ProfileView에 표시되는지 확인
    const updatedSubjectLocator = page.locator('span:has-text("과목 : ")').locator('+ span');
    await expect(updatedSubjectLocator).toHaveText(newSubject);

    // 변경된 학교가 ProfileView에서 활성화 상태로 표시되는지 확인
    const updatedSchool = page.locator('div.bg-slate-800.text-white span').first();
    await expect(updatedSchool).toHaveText(newSchoolText);

    // 다시 수정 페이지로 진입해서 변경사항이 유지되는지 확인
    await page.click('button:has-text("프로필 수정하기")');

    // 과목 드롭다운에 새로운 과목이 표시되는지 확인
    if (newSubject) {
      const updatedSubjectButton = page.locator('button').filter({ hasText: newSubject });
      await expect(updatedSubjectButton).toBeVisible();
    }

    // 학교 선택에서 새로운 학교가 선택된 상태(bg-slate-800)인지 확인
    const persistedSchoolButton = page.locator('button').filter({ hasText: newSchoolText });
    await expect(persistedSchoolButton).toHaveClass(/bg-slate-800/);
  });

  test('5. 비밀번호 수정 - 비밀번호 유효성 검사 및 다양한 에러 케이스에 맞는 UI가 나오고, 정상적으로 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인을 입력하고 저장하기 버튼을 누르면 성공적으로 변경되었다는 alert 창이 나온다', async ({
    page,
  }) => {
    await performLogin(page, 'test@edukit.co.kr', 'bbangs$00');

    await page.click('header img[alt="profile image"]');
    await page.click('a[href="/mypage"]');

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
    await page.fill('input[placeholder="현재 비밀번호"]', 'bbangs$00');
    await page.fill('input[placeholder="새 비밀번호"]', '123');
    await page.click('button:has-text("저장")');
    await expect(page.locator('text=비밀번호는 최소 8자 이상이어야 합니다.')).toBeVisible();

    // 새 비밀번호 확인에 다른 값 입력
    await page.fill('input[placeholder="새 비밀번호"]', 'newPassword123!');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'differentPassword');
    await page.click('button:has-text("저장")');
    await expect(page.locator('text=새 비밀번호가 일치하지 않습니다.')).toBeVisible();

    // 기존 비밀번호와 같은 값 입력
    await page.fill('input[placeholder="새 비밀번호"]', 'bbangs$00');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'bbangs$00');
    expectAlertMessage(page, '새로운 비밀번호는 기존 비밀번호와 같을 수 없습니다.');
    await page.click('button:has-text("저장")');

    await page.waitForTimeout(1000);

    // 현재 비밀번호가 틀린 경우
    await page.fill('input[placeholder="현재 비밀번호"]', 'password1234');
    await page.fill('input[placeholder="새 비밀번호"]', 'password1234!');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'password1234!');
    expectAlertMessage(page, '현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
    await page.click('button:has-text("저장")');

    await page.waitForTimeout(1000);

    // 정상적인 비밀번호 변경
    await page.fill('input[placeholder="현재 비밀번호"]', 'bbangs$00');
    await page.fill('input[placeholder="새 비밀번호"]', 'password1234');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'password1234');

    expectAlertMessage(page, '비밀번호가 성공적으로 변경되었습니다.');
    await page.click('button:has-text("저장")');

    await page.waitForTimeout(1000);

    // 변경된 비밀번호 원상복구 시키는 로직
    await page.locator('[data-testid="password-edit-button"]').click();
    await page.fill('input[placeholder="현재 비밀번호"]', 'password1234');
    await page.fill('input[placeholder="새 비밀번호"]', 'bbangs$00');
    await page.fill('input[placeholder="새 비밀번호 확인"]', 'bbangs$00');
    expectAlertMessage(page, '비밀번호가 성공적으로 변경되었습니다.');
    await page.click('button:has-text("저장")');
  });
});

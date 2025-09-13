import { test, expect } from '@playwright/test';

import { loginAsUser, loginAsUnverified } from './utils/test-helpers';

test.describe('학생 관리 페이지 E2E 테스트', () => {
  test.describe('접근 권한 테스트', () => {
    test('로그인 안한 상태에서 학생 관리 페이지에 접근하면 로그인이 필요하다는 UI컴포넌트가 나오고 업로드 버튼, 필터 버튼이 disabled 상태로 나온다', async ({
      page,
    }) => {
      await page.goto('/manage-student');
      await page.waitForTimeout(3000);

      // 로그인이 필요합니다 메시지 확인
      await expect(page.locator('text=로그인이 필요합니다')).toBeVisible();

      // 엑셀 파일에서 명단 업로드 버튼 disabled 상태 확인
      const uploadButton = page.locator('button:has-text("엑셀 파일에서 명단 업로드")');
      await expect(uploadButton).toBeDisabled();

      // 필터 버튼 disabled 상태 확인
      const filterButton = page.locator('button:has-text("필터")');
      await expect(filterButton).toBeDisabled();
    });

    test('이메일 미인증 사용자로 학생 관리 페이지에 접근하면 이메일 인증 후 서비스 이용이 가능하다는 메세지가 나오고 업로드, 필터 버튼이 disabled 상태로 나온다', async ({
      page,
    }) => {
      await loginAsUnverified(page);
      await page.goto('/manage-student');
      await page.waitForTimeout(3000);

      // 이메일 인증 후 서비스 이용이 가능합니다 메시지 확인
      await expect(page.locator('text=이메일 인증 후 서비스 이용이 가능합니다.')).toBeVisible();

      // 엑셀 파일에서 명단 업로드 버튼 disabled 상태 확인
      const uploadButton = page.locator('button:has-text("엑셀 파일에서 명단 업로드")');
      await expect(uploadButton).toBeDisabled();

      // 필터 버튼 disabled 상태 확인
      const filterButton = page.locator('button:has-text("필터")');
      await expect(filterButton).toBeDisabled();
    });

    test('인증된 사용자가 학생 관리 페이지에 접근 시 학생 관리 대시보드가 나온다', async ({
      page,
    }) => {
      await loginAsUser(page);
      await page.goto('/manage-student');
      await page.waitForTimeout(3000);

      // 학생 관리 대시보드 확인
      await expect(page.locator('h2:has-text("학생 관리")')).toBeVisible();

      // 엑셀 파일에서 명단 업로드 버튼 enabled 상태 확인
      const uploadButton = page.locator('button:has-text("엑셀 파일에서 명단 업로드")');
      await expect(uploadButton).toBeEnabled();

      // 필터 버튼 enabled 상태 확인
      const filterButton = page.locator('button:has-text("필터")');
      await expect(filterButton).toBeEnabled();
    });
  });

  test.describe('학생 데이터 관리', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsUser(page);
      await page.goto('/manage-student');
      await page.waitForTimeout(3000);
    });

    test('학생 추가 버튼을 클릭해서 적절한 입력값을 채우고 추가 버튼을 누르면 해당 데이터가 잘 보인다', async ({
      page,
    }) => {
      // 학생 추가 버튼 클릭
      await page.click('button:has-text("학생 추가")');

      // 대시보드 맨 위에 새로운 행이 나오는지 확인 (AddStudentRow 컴포넌트)
      const inputFields = page.locator('input[placeholder="입력"]');
      await expect(inputFields).toHaveCount(4);

      // 학년, 반, 번호, 이름 입력 (학년/반/번호 순으로 정렬되므로 1로 세팅)
      await inputFields.nth(0).fill('1'); // 학년
      await inputFields.nth(1).fill('1'); // 반
      await inputFields.nth(2).fill('1'); // 번호
      await inputFields.nth(3).fill('테스트학생'); // 이름

      // 항목 추가 버튼 클릭하여 드롭다운 열기
      await page.click('button:has-text("항목 추가")');

      // 세특 버튼 클릭
      await page.click('[data-testid="record-option-subject"]');

      // 추가 버튼 클릭
      await page.click('[data-testid="add-student-button"]');

      // 입력한 데이터가 나오는지 확인
      await expect(page.locator('text=테스트학생')).toBeVisible();
    });

    test('학생 수정 기능이 잘 동작한다', async ({ page }) => {
      // StudentRow 컴포넌트의 첫 번째 학생 행을 찾기
      // div 기반 구조에서 학생 행을 선택
      const studentRows = page.locator('[data-testid="student-row"]');
      const firstStudentRow = studentRows.first();

      // 이름 셀을 찾아서 수정 (StudentRow 컴포넌트 내의 이름 필드)
      const nameField = firstStudentRow
        .locator('text="이름"')
        .locator('..')
        .locator('input, span[contenteditable], div[contenteditable]')
        .first();

      // 이름 필드 더블클릭하여 편집 모드 진입
      await nameField.dblclick();

      // 입력 필드가 나타나면 값 변경
      await page.waitForTimeout(500); // 편집 모드 전환 대기

      // 편집 가능한 입력 필드를 찾아서 수정
      const editableInput = firstStudentRow.locator('input[type="text"]').first();
      if (await editableInput.isVisible()) {
        await editableInput.clear();
        await editableInput.fill('이승섭');
        await editableInput.press('Enter');
      } else {
        // contenteditable인 경우
        const editableDiv = firstStudentRow.locator('[contenteditable="true"]').first();
        await editableDiv.clear();
        await editableDiv.fill('이승섭');
        await editableDiv.press('Enter');
      }

      // 변경된 데이터가 나오는지 확인
      await expect(page.locator('text=이승섭')).toBeVisible();
    });

    test('학생 삭제 기능이 잘 동작한다', async ({ page }) => {
      // 초기 학생 수 확인 및 저장
      const initialCountElement = page.locator('text=/총 \\d+명의 학생 등록/');
      await expect(initialCountElement).toBeVisible();

      const initialCountText = await initialCountElement.textContent();
      const initialCountMatch = initialCountText?.match(/총 (\d+)명의 학생 등록/);
      const initialCount = initialCountMatch ? parseInt(initialCountMatch[1]) : 0;

      // 첫 번째 학생 행의 체크박스 클릭 (StudentRow 컴포넌트 내)
      const firstStudentCheckbox = page.locator('[data-testid="student-defaultbox"]').first();
      await firstStudentCheckbox.click();

      // "총 1명의 학생 선택" 글씨 확인
      await expect(page.locator('text=총 1명의 학생 선택')).toBeVisible();

      // 삭제 버튼 클릭
      await page.click('button:has-text("삭제")');

      // "정말 삭제하시겠습니까?" 모달 확인
      await expect(page.locator('text=정말 삭제하시겠습니까?')).toBeVisible();

      // 모달의 삭제 버튼 클릭
      await page.click('button:has-text("삭제"):last-of-type');

      // 삭제 후 학생 수가 1 줄어들었는지 확인
      await page.waitForTimeout(1000);

      // 삭제 후 학생 수 확인
      const finalCountElement = page.locator('text=/총 \\d+명의 학생 등록/');
      await expect(finalCountElement).toBeVisible();

      const finalCountText = await finalCountElement.textContent();
      const finalCountMatch = finalCountText?.match(/총 (\d+)명의 학생 등록/);
      const finalCount = finalCountMatch ? parseInt(finalCountMatch[1]) : 0;

      // 학생 수가 1 줄어들었는지 확인
      expect(finalCount).toBe(initialCount - 1);
    });

    test('무한 스크롤 기능을 검증한다', async ({ page }) => {
      // 초기 총 학생 수 확인 및 저장 (FilterSection에서)
      const initialTotalElement = page.locator('text=/총 \\d+명의 학생 등록/');
      await expect(initialTotalElement).toBeVisible();

      const initialTotalText = await initialTotalElement.textContent();
      const initialTotalMatch = initialTotalText?.match(/총 (\d+)명의 학생 등록/);
      const totalStudentCount = initialTotalMatch ? parseInt(initialTotalMatch[1]) : 0;

      // 초기 로드된 학생 행 수 확인
      let currentRowCount = await page.locator('[data-testid="student-row"]').count();
      console.log(`초기 로드된 학생 수: ${currentRowCount}`);

      // 무한 스크롤을 위해 마지막 학생 요소까지 스크롤
      const maxAttempts = 10;
      let attempts = 0;

      while (currentRowCount < totalStudentCount && attempts < maxAttempts) {
        // 현재 마지막 학생 요소로 스크롤
        const lastStudent = page.locator('[data-testid="student-row"]').last();

        // 마지막 요소가 뷰포트에 보이도록 스크롤
        await lastStudent.scrollIntoViewIfNeeded();

        // 조금 더 아래로 스크롤하여 무한 스크롤 트리거
        await page.evaluate(() => {
          window.scrollBy(0, 500);
        });

        // 네트워크 요청 완료 대기
        await page.waitForTimeout(2000);

        const newRowCount = await page.locator('[data-testid="student-row"]').count();
        console.log(`스크롤 후 학생 수: ${newRowCount}`);

        if (newRowCount === currentRowCount) {
          // 더 이상 로드되지 않으면 강제로 더 아래로 스크롤
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
          });
          await page.waitForTimeout(2000);

          const finalCheck = await page.locator('[data-testid="student-row"]').count();
          if (finalCheck === newRowCount) {
            attempts++;
          } else {
            currentRowCount = finalCheck;
            attempts = 0; // 새 데이터가 로드되면 시도 횟수 리셋
          }
        } else {
          currentRowCount = newRowCount;
          attempts = 0; // 새 데이터가 로드되면 시도 횟수 리셋
        }
      }

      console.log(`최종 로드된 학생 수: ${currentRowCount}, 총 학생 수: ${totalStudentCount}`);

      // 맨 위로 올라가기
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);

      // DashboardHeader의 전체 선택 체크박스 클릭
      const headerCheckbox = page.locator('[data-testid="header-defaultbox"]');
      await headerCheckbox.click();

      // 전체 선택되었는지 확인 - 처음 확인한 총 학생 수와 동일한지 검증
      const selectedElement = page.locator(`text=총 ${totalStudentCount}명의 학생 선택`);
      await expect(selectedElement).toBeVisible();

      // 추가 검증: 선택된 학생 수가 총 학생 수와 정확히 일치하는지 확인
      const selectedText = await page.locator('text=/총 \\d+명의 학생 선택/').textContent();
      const selectedMatch = selectedText?.match(/총 (\d+)명의 학생 선택/);
      const selectedCount = selectedMatch ? parseInt(selectedMatch[1]) : 0;

      expect(selectedCount).toBe(totalStudentCount);

      // 실제로 화면에 로드된 학생 행 수도 검증
      const finalRowCount = await page.locator('[data-testid="student-row"]').count();
      expect(finalRowCount).toBe(totalStudentCount);
    });

    test('필터 기능을 검증한다', async ({ page }) => {
      // 필터 버튼 클릭 후 학년 1 선택
      await page.click('button:has-text("필터")');
      await page.click('button:has-text("학년")');
      await page.locator('div[role="option"]:has-text("1")').first().click();

      // 필터 버튼 클릭 후 반 9 선택
      await page.click('button:has-text("필터")');
      await page.click('button:has-text("반")');
      await page.locator('div[role="option"]:has-text("9")').first().click();

      // 필터 버튼 클릭 후 생기부 관리 항목에서 행발 선택
      await page.click('button:has-text("필터")');
      await page.click('button:has-text("생기부 관리 항목")');
      await page.locator('div[role="option"]:has-text("행발")').first().click();
      await page.click('text=/총 \\d+명의 학생 등록/');

      // 학년 1, 반 9, 번호 4, 이름 권선우, 생활기록부 관리 항목 세특, 행발 데이터 확인
      await expect(page.locator('text=권선우')).toBeVisible();

      // 필터의 모든 x 버튼 클릭하여 필터 해제
      const filterXButtons = page.locator('button[aria-label="필터 제거"]');
      const filterCount = await filterXButtons.count();

      for (let i = 0; i < filterCount; i++) {
        await filterXButtons.first().click();
        await page.waitForTimeout(500);
      }

      // 다시 모든 학생이 나오는지 확인 (행 수가 늘어났는지 확인)
      await page.waitForTimeout(1000);
      const allRows = page.locator('[data-testid="student-row"]');
      const finalRowCount = await allRows.count();
      expect(finalRowCount).toBeGreaterThan(1);
    });
  });
});

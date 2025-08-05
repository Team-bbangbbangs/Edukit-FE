import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render, loginAsUser } from '@/__tests__/utils/test-utils';
import ProfileEdit from '@/domains/profile/components/profile-edit';
import type { ProfileResponse } from '@/domains/profile/types/profile';

const mockProfile: ProfileResponse = {
  nickname: '이승섭',
  email: 'test@edukit.co.kr',
  subject: '수학',
  school: 'middle',
  isTeacherVerified: true,
};

global.alert = jest.fn();

describe('profile-edit 컴포넌트 단위 테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const mockOnChangeView = jest.fn();

  beforeEach(async () => {
    user = userEvent.setup();
    mockOnChangeView.mockClear();
    clearAllTestMocks();

    await loginAsUser();

    render(<ProfileEdit profile={mockProfile} onChangeView={mockOnChangeView} />);

    (global.alert as jest.Mock).mockClear();
  });

  describe('닉네임 유효성 검사', () => {
    it('닉네임이 비어있으면 중복 확인과 저장 버튼이 비활성화된다', async () => {
      const nicknameInput = screen.getByPlaceholderText('닉네임을 입력하세요');
      const checkButton = screen.getByRole('button', { name: '중복 확인' });
      const saveButton = screen.getByRole('button', { name: '저장' });

      await user.clear(nicknameInput);

      expect(checkButton).toBeDisabled();
      expect(saveButton).toBeDisabled();
    });

    it('닉네임을 입력하면 중복 확인 버튼이 활성화된다', async () => {
      const nicknameInput = screen.getByPlaceholderText('닉네임을 입력하세요');
      const checkButton = screen.getByRole('button', { name: '중복 확인' });

      await user.clear(nicknameInput);
      await user.type(nicknameInput, 'ㅇㅇ');

      expect(checkButton).toBeEnabled();
    });

    it('금칙어가 포함된 닉네임에 대해 에러 메시지가 표시된다', async () => {
      const nicknameInput = screen.getByPlaceholderText('닉네임을 입력하세요');
      const checkButton = screen.getByRole('button', { name: '중복 확인' });

      await user.clear(nicknameInput);
      await user.type(nicknameInput, 'ㅇㅇ');
      await user.click(checkButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          '금칙어가 들어갔습니다. 다른 닉네임을 사용해주세요.',
        );
      });
    });

    it('중복된 닉네임에 대해 에러 메시지가 표시된다', async () => {
      const nicknameInput = screen.getByPlaceholderText('닉네임을 입력하세요');
      const checkButton = screen.getByRole('button', { name: '중복 확인' });

      await user.clear(nicknameInput);
      await user.type(nicknameInput, '선생님1');
      await user.click(checkButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('현재 사용 중인 닉네임입니다.');
      });
    });

    it('사용 가능한 닉네임에 대해 성공 메시지가 표시되고 저장 버튼이 활성화된다', async () => {
      const nicknameInput = screen.getByPlaceholderText('닉네임을 입력하세요');
      const checkButton = screen.getByRole('button', { name: '중복 확인' });
      const saveButton = screen.getByRole('button', { name: '저장' });

      await user.clear(nicknameInput);
      await user.type(nicknameInput, '선생님123');
      await user.click(checkButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('사용 가능한 닉네임입니다!');
      });

      await waitFor(() => {
        expect(saveButton).toBeEnabled();
      });
    });
  });

  describe('과목 및 학교 선택', () => {
    it('과목 드롭다운이 올바르게 동작한다', async () => {
      const subjectButton = screen.getByRole('button', { name: '수학' });

      await user.click(subjectButton);

      await waitFor(() => {
        expect(screen.getByText('영어')).toBeInTheDocument();
      });

      await user.click(screen.getByText('영어'));

      expect(subjectButton).toHaveTextContent('영어');
    });

    it('학교 유형 선택이 올바르게 동작한다', async () => {
      const middleSchoolButton = screen.getByText('중학교');
      const highSchoolButton = screen.getByText('고등학교');

      expect(middleSchoolButton.closest('button')).toHaveClass('bg-slate-800');
      expect(highSchoolButton.closest('button')).toHaveClass('bg-slate-200');

      await user.click(highSchoolButton);

      await waitFor(() => {
        expect(highSchoolButton.closest('button')).toHaveClass('bg-slate-800');
        expect(middleSchoolButton.closest('button')).toHaveClass('bg-slate-200');
      });
    });
  });

  describe('프로필 저장', () => {
    let requestSpy: jest.SpyInstance;

    beforeEach(() => {
      requestSpy = jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
      requestSpy.mockRestore();
    });

    it('프로필 정보 저장이 성공하면 API 요청이 발생하고 onChangeView가 호출된다', async () => {
      const nicknameInput = screen.getByPlaceholderText('닉네임을 입력하세요');
      const checkButton = screen.getByRole('button', { name: '중복 확인' });
      const saveButton = screen.getByRole('button', { name: '저장' });

      await user.clear(nicknameInput);
      await user.type(nicknameInput, '새로운닉네임');
      await user.click(checkButton);

      expect(global.alert).toHaveBeenCalledWith('사용 가능한 닉네임입니다!');

      const subjectButton = screen.getByRole('button', { name: '수학' });
      await user.click(subjectButton);

      await waitFor(() => {
        expect(screen.getByText('영어')).toBeInTheDocument();
      });

      await user.click(screen.getByText('영어'));
      expect(subjectButton).toHaveTextContent('영어');

      const middleSchoolButton = screen.getByText('중학교');
      const highSchoolButton = screen.getByText('고등학교');

      expect(middleSchoolButton.closest('button')).toHaveClass('bg-slate-800');
      expect(highSchoolButton.closest('button')).toHaveClass('bg-slate-200');

      await user.click(highSchoolButton);

      await waitFor(() => {
        expect(highSchoolButton.closest('button')).toHaveClass('bg-slate-800');
        expect(middleSchoolButton.closest('button')).toHaveClass('bg-slate-200');
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/users/profile'),
          expect.objectContaining({
            method: 'PATCH',
            body: expect.stringContaining('"nickname":"새로운닉네임"'),
          }),
        );
      });

      await waitFor(() => {
        expect(mockOnChangeView).toHaveBeenCalledTimes(1);
      });
    });

    it('닉네임을 원래대로 되돌리면 중복 확인 없이도 저장할 수 있다', async () => {
      const nicknameInput = screen.getByPlaceholderText('닉네임을 입력하세요');
      const saveButton = screen.getByRole('button', { name: '저장' });

      await user.clear(nicknameInput);
      await user.type(nicknameInput, '임시변경');
      await user.clear(nicknameInput);
      await user.type(nicknameInput, '이승섭');

      await user.click(saveButton);

      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/users/profile'),
          expect.objectContaining({
            method: 'PATCH',
          }),
        );
      });

      expect(global.alert).not.toHaveBeenCalledWith('닉네임 중복확인을 해주세요.');
    });
  });
});

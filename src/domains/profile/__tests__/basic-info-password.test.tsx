import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render, loginAsUser } from '@/__tests__/utils/test-utils';
import BasicInfo from '@/domains/profile/components/basic-info';

describe('basic-info-password 컴포넌트 단위 테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;
  global.alert = jest.fn();

  beforeEach(async () => {
    user = userEvent.setup();
    clearAllTestMocks();

    await loginAsUser();

    render(<BasicInfo email="test@edukit.co.kr" />);

    (global.alert as jest.Mock).mockClear();

    await user.click(screen.getByTestId('password-edit-button'));
  });

  it('비밀번호 수정 버튼을 클릭하면 모든 비밀번호 입력 필드가 렌더링된다', async () => {
    expect(screen.getByPlaceholderText('현재 비밀번호')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('새 비밀번호')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('새 비밀번호 확인')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('필수 필드 누락 시 에러 메시지가 표시되고, 비밀번호 input들의 border가 빨간색으로 변한다', async () => {
    const currentPasswordInput = screen.getByPlaceholderText('현재 비밀번호');
    const newPasswordInput = screen.getByPlaceholderText('새 비밀번호');
    const confirmPasswordInput = screen.getByPlaceholderText('새 비밀번호 확인');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(screen.getByTestId('current-password-error')).toBeInTheDocument();
    expect(screen.getByTestId('new-password-error')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-error')).toBeInTheDocument();
    expect(currentPasswordInput).toHaveClass('border-red-500');
    expect(newPasswordInput).toHaveClass('border-red-500');
    expect(confirmPasswordInput).toHaveClass('border-red-500');
  });

  it('새 비밀번호 유효성 검사가 올바르게 동작하고, 새 비밀번호 input들의 border가 빨간색으로 변한다', async () => {
    const currentPasswordInput = screen.getByPlaceholderText('현재 비밀번호');
    const newPasswordInput = screen.getByPlaceholderText('새 비밀번호');
    const confirmPasswordInput = screen.getByPlaceholderText('새 비밀번호 확인');

    await user.type(currentPasswordInput, 'password123!');
    await user.type(newPasswordInput, '123');
    await user.type(confirmPasswordInput, '123');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(screen.getByTestId('new-password-error')).toBeInTheDocument();
    expect(newPasswordInput).toHaveClass('border-red-500');
  });

  it('새 비밀번호 확인이 일치하지 않을 때 에러 메시지가 표시되고, 새 비밀번호 확인 border가 빨간색으로 변한다', async () => {
    const currentPasswordInput = screen.getByPlaceholderText('현재 비밀번호');
    const newPasswordInput = screen.getByPlaceholderText('새 비밀번호');
    const confirmPasswordInput = screen.getByPlaceholderText('새 비밀번호 확인');

    await user.type(currentPasswordInput, 'password123!');
    await user.type(newPasswordInput, 'newPassword123!');
    await user.type(confirmPasswordInput, 'differentPassword');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(screen.getByTestId('confirm-password-error')).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveClass('border-red-500');
  });

  it('현재 비밀번호가 틀린 경우 에러 메시지가 표시된다', async () => {
    const currentPasswordInput = screen.getByPlaceholderText('현재 비밀번호');
    const newPasswordInput = screen.getByPlaceholderText('새 비밀번호');
    const confirmPasswordInput = screen.getByPlaceholderText('새 비밀번호 확인');

    await user.type(currentPasswordInput, 'password1234');
    await user.type(newPasswordInput, 'newPassword123!');
    await user.type(confirmPasswordInput, 'newPassword123!');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(global.alert).toHaveBeenCalledWith(
      '현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
    );
  });

  it('기존 비밀번호와 동일한 새 비밀번호 사용 시 에러 메시지가 표시된다', async () => {
    const currentPasswordInput = screen.getByPlaceholderText('현재 비밀번호');
    const newPasswordInput = screen.getByPlaceholderText('새 비밀번호');
    const confirmPasswordInput = screen.getByPlaceholderText('새 비밀번호 확인');

    await user.type(currentPasswordInput, 'password123!');
    await user.type(newPasswordInput, 'password123!');
    await user.type(confirmPasswordInput, 'password123!');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(global.alert).toHaveBeenCalledWith(
      '새로운 비밀번호는 기존 비밀번호와 같을 수 없습니다.',
    );
  });

  it('정상적인 비밀번호 변경이 성공한다', async () => {
    const currentPasswordInput = screen.getByPlaceholderText('현재 비밀번호');
    const newPasswordInput = screen.getByPlaceholderText('새 비밀번호');
    const confirmPasswordInput = screen.getByPlaceholderText('새 비밀번호 확인');

    await user.type(currentPasswordInput, 'password123!');
    await user.type(newPasswordInput, 'newPassword123!');
    await user.type(confirmPasswordInput, 'newPassword123!');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(global.alert).toHaveBeenCalledWith('비밀번호가 성공적으로 변경되었습니다.');
  });

  it('비밀번호 수정을 취소할 수 있다', async () => {
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.queryByPlaceholderText('현재 비밀번호')).not.toBeInTheDocument();
    expect(screen.getByTestId('password-edit-button')).toBeInTheDocument();
  });

  it('비밀번호 수정 모드일 때 이메일 수정 버튼이 숨겨진다', async () => {
    expect(screen.queryByTestId('email-edit-button')).not.toBeInTheDocument();
  });
});

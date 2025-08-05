import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render, loginAsUser } from '@/__tests__/utils/test-utils';
import BasicInfo from '@/domains/profile/components/basic-info';

describe('basic-info-email 컴포넌트 단위 테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;
  global.alert = jest.fn();
  beforeEach(async () => {
    user = userEvent.setup();
    clearAllTestMocks();

    await loginAsUser();

    render(<BasicInfo email="test@edukit.co.kr" />);

    (global.alert as jest.Mock).mockClear();
  });

  it('이메일 정보가 올바르게 표시된다', () => {
    expect(screen.getByText('test@edukit.co.kr')).toBeInTheDocument();
    expect(screen.getByTestId('email-edit-button')).toBeInTheDocument();
  });

  it('이메일 수정 모드로 전환할 수 있다', async () => {
    await user.click(screen.getByTestId('email-edit-button'));

    expect(screen.getByPlaceholderText('새로운 이메일을 입력해주세요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('유효하지 않은 이메일 형식 시 에러 메시지가 표시되고, 이메일 수정 input의 border가 빨간색으로 변한다.', async () => {
    await user.click(screen.getByTestId('email-edit-button'));

    const emailInput = screen.getByPlaceholderText('새로운 이메일을 입력해주세요');

    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(screen.getByText('이메일 형식이 유효하지 않습니다.')).toBeInTheDocument();
    expect(emailInput).toHaveClass('border-red-500');
  });

  it('교직 이메일이 아닌 경우 에러 메시지가 표시되고, 이메일 수정 input의 border가 빨간색으로 변한다.', async () => {
    await user.click(screen.getByTestId('email-edit-button'));

    const emailInput = screen.getByPlaceholderText('새로운 이메일을 입력해주세요');

    await user.clear(emailInput);
    await user.type(emailInput, 'new123@daum.net');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(screen.getByText('교직 이메일이 아닙니다.')).toBeInTheDocument();
    expect(emailInput).toHaveClass('border-red-500');
  });

  it('중복된 이메일 사용 시 에러 메시지가 표시된다', async () => {
    await user.click(screen.getByTestId('email-edit-button'));

    const emailInput = screen.getByPlaceholderText('새로운 이메일을 입력해주세요');

    await user.clear(emailInput);
    await user.type(emailInput, 'test@edukit.co.kr');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(global.alert).toHaveBeenCalledWith('이미 등록된 회원입니다.');
  });

  it('이메일 변경 성공 시 성공 메시지가 표시되고 뷰 모드로 전환된다', async () => {
    await user.click(screen.getByTestId('email-edit-button'));

    const emailInput = screen.getByPlaceholderText('새로운 이메일을 입력해주세요');

    await user.clear(emailInput);
    await user.type(emailInput, 'new123@edukit.co.kr');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(global.alert).toHaveBeenCalledWith('이메일이 성공적으로 변경되었습니다.');
  });

  it('이메일 수정을 취소할 수 있다', async () => {
    await user.click(screen.getByTestId('email-edit-button'));

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.queryByPlaceholderText('새로운 이메일을 입력해주세요')).not.toBeInTheDocument();
    expect(screen.getByTestId('email-edit-button')).toBeInTheDocument();
  });

  it('이메일 수정 모드일 때 비밀번호 수정 버튼이 숨겨진다', async () => {
    const emailEditButton = screen.getByTestId('email-edit-button');
    await user.click(emailEditButton);

    expect(screen.queryByTestId('password-edit-button')).not.toBeInTheDocument();
  });
});

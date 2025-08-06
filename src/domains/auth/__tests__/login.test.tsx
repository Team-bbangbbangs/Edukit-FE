import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '@/__tests__/utils/test-utils';

import Login from '../components/login/login';

describe('login 컴포넌트 단위 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('로그인 폼이 정상적으로 렌더링된다', () => {
    render(<Login />);

    expect(screen.getByText('Edukit')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByText('회원가입')).toBeInTheDocument();
    expect(screen.getByText('비밀번호 찾기')).toBeInTheDocument();
  });

  it('유효하지 않은 이메일 입력시 에러 메시지가 표시되고, 이메일 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('이메일 형식이 유효하지 않습니다.')).toBeInTheDocument();
      expect(emailInput).toHaveClass('border-red-500');
    });
  });

  it('교직 이메일이 아닌 경우 에러 메시지가 표시되고, 이메일 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@daum.net');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('교직 이메일이 아닙니다.')).toBeInTheDocument();
      expect(emailInput).toHaveClass('border-red-500');
    });
  });

  it('빈 이메일 입력시 에러 메시지가 표시되고, 이메일 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();
      expect(emailInput).toHaveClass('border-red-500');
    });
  });

  it('빈 비밀번호 입력시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@edukit.co.kr');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('8자 이하의 비밀번호 입력시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@edukit.co.kr');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('비밀번호는 최소 8자 이상이어야 합니다.')).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('20자가 넘는 비밀번호 입력시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@edukit.co.kr');
    await user.type(passwordInput, 'ab12345678910112123451234512');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('비밀번호는 최대 20자 이하이어야 합니다.')).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('유효하지 않은 비밀번호 형식 입력시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@edukit.co.kr');
    await user.type(passwordInput, '12345678');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('영문/숫자/특수문자 중 2가지 이상 포함해야 합니다.'),
      ).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('동일 문자 3번 연속 사용시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@edukit.co.kr');
    await user.type(passwordInput, 'aaa12345');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('동일 문자를 3번 연속으로 사용할 수 없습니다.')).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('유효한 폼 데이터 입력시 로그인이 성공한다', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@edukit.co.kr');
    await user.type(passwordInput, 'password1234!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetAuthData).toHaveBeenCalledWith(
        expect.stringContaining('user-access-token'),
        false,
      );
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('잘못된 비밀번호로 로그인 시 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@edukit.co.kr');
    await user.type(passwordInput, 'ab1234567890');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
    });
  });

  it('존재하지 않는 사용자로 로그인 시 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'nonexistent@edukit.co.kr');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('존재하지 않는 회원입니다. 회원가입을 진행해주세요.'),
      ).toBeInTheDocument();
    });
  });

  it('관리자 계정으로 로그인이 성공한다', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'admin@edukit.co.kr');
    await user.type(passwordInput, 'password1234');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetAuthData).toHaveBeenCalledWith(
        expect.stringContaining('admin-access-token'),
        true,
      );
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('로그인 폼 제출 시 이전 서버 에러가 초기화된다', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });

    await user.type(emailInput, 'test@edukit.co.kr');
    await user.type(passwordInput, 'ab1234567890');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
    });

    await user.clear(passwordInput);
    await user.type(passwordInput, 'password1234!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetAuthData).toHaveBeenCalled();
      expect(screen.queryByText('비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();
    });
  });

  it('회원가입 링크가 올바른 href를 가진다', () => {
    render(<Login />);

    const signupLink = screen.getByText('회원가입');
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('비밀번호 찾기 링크가 올바른 href를 가진다', () => {
    render(<Login />);

    const findPasswordLink = screen.getByText('비밀번호 찾기');
    expect(findPasswordLink.closest('a')).toHaveAttribute('href', '/find-password');
  });
});

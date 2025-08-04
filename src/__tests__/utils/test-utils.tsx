import { type ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Login from '@/domains/auth/components/login/login';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

/**
 * MSW를 활용한 어드민 계정 로그인 헬퍼 함수
 * - MSW post-login.ts의 admin@edukit.co.kr / password1234 사용
 * - 로그인 성공 후 mockUseAuth를 어드민 상태로 업데이트
 * - DOM을 정리하여 다른 컴포넌트 렌더링에 영향을 주지 않음
 */
export const loginAsAdmin = async () => {
  const user = userEvent.setup();
  customRender(<Login />);

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

  mockUseAuth.mockReturnValue({
    accessToken: expect.stringContaining('admin-access-token'),
    isAdmin: true,
    setAuthData: mockSetAuthData,
  });

  cleanup();
};

/**
 * MSW를 활용한 일반 사용자 계정 로그인 헬퍼 함수
 * - MSW post-login.ts의 test@edukit.co.kr / password1234! 사용
 * - 로그인 성공 후 mockUseAuth를 일반 사용자 상태로 업데이트
 * - DOM을 정리하여 다른 컴포넌트 렌더링에 영향을 주지 않음
 */
export const loginAsUser = async () => {
  const user = userEvent.setup();
  customRender(<Login />);

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

  mockUseAuth.mockReturnValue({
    accessToken: expect.stringContaining('user-access-token'),
    isAdmin: false,
    setAuthData: mockSetAuthData,
  });

  cleanup();
};

export { customRender as render };

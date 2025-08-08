import { type ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';

import { tokenStore } from '@/shared/lib/token-store';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
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
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@edukit.co.kr',
      password: 'password1234',
    }),
  });

  if (!response.ok) {
    throw new Error(`어드민 로그인 실패: ${response.status}`);
  }

  const { data } = await response.json();
  const { accessToken, isAdmin } = data;

  mockUseAuth.mockReturnValue({
    accessToken,
    isAdmin,
    setAuthData: mockSetAuthData,
  });

  tokenStore.setToken(accessToken, isAdmin);
};

/**
 * MSW를 활용한 일반 사용자 계정 로그인 헬퍼 함수
 * - MSW post-login.ts의 test@edukit.co.kr / password1234! 사용
 * - 로그인 성공 후 mockUseAuth를 일반 사용자 상태로 업데이트
 * - DOM을 정리하여 다른 컴포넌트 렌더링에 영향을 주지 않음
 */
export const loginAsUser = async () => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@edukit.co.kr',
      password: 'password1234!',
    }),
  });

  if (!response.ok) {
    throw new Error(`일반 사용자 로그인 실패: ${response.status}`);
  }

  const { data } = await response.json();
  const { accessToken, isAdmin } = data;

  tokenStore.setToken(accessToken, isAdmin);

  mockUseAuth.mockReturnValue({
    accessToken,
    isAdmin,
    setAuthData: mockSetAuthData,
  });
};

export const loginAsUnverifiedUser = async () => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@edukit.co.kr',
      password: 'ab12345678',
    }),
  });

  if (!response.ok) {
    throw new Error(`미인증 사용자 로그인 실패: ${response.status}`);
  }

  const { data } = await response.json();
  const { accessToken, isAdmin } = data;

  mockUseAuth.mockReturnValue({
    accessToken,
    isAdmin,
    setAuthData: mockSetAuthData,
  });

  tokenStore.setToken(accessToken, isAdmin);
};

export { customRender as render };

import React from 'react';

import '@testing-library/jest-dom';

import { setupMSW } from '@/__tests__/utils/msw-setup';

// 테스트 환경에서 MSW 활성화
process.env.NEXT_PUBLIC_API_MOCKING = 'enabled';
setupMSW();

// IntersectionObserver Mock
global.IntersectionObserver = jest.fn((_callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Next.js useRouter Mock
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    refresh: mockRefresh,
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// AuthProvider Mock
const mockSetAuthData = jest.fn();
const mockUseAuth = jest.fn(() => ({
  setAuthData: mockSetAuthData,
  accessToken: null,
  isAdmin: null,
}));

jest.mock('@/shared/providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockUseAuth(),
}));

// 전역 변수로 mock 함수들을 사용할 수 있도록 설정
(global as any).mockPush = mockPush;
(global as any).mockReplace = mockReplace;
(global as any).mockBack = mockBack;
(global as any).mockRefresh = mockRefresh;
(global as any).mockSetAuthData = mockSetAuthData;
(global as any).mockUseAuth = mockUseAuth;

// SVG 파일 모킹
jest.mock('@/shared/components/ui/icon/icon', () => {
  const MockIcon = React.forwardRef<SVGSVGElement, any>((props: any, ref: any) => {
    const { hoverColor, color, ...validProps } = props;
    return React.createElement('svg', { ref, ...validProps });
  });
  MockIcon.displayName = 'MockIcon';

  return {
    Icons: {
      Add: MockIcon,
      Close: MockIcon,
      Check: MockIcon,
      BoxDefault: MockIcon,
      BoxChecked: MockIcon,
      Upload: MockIcon,
      Download: MockIcon,
      ChevronUp: MockIcon,
      ChevronDown: MockIcon,
      Filter: MockIcon,
      Logo: MockIcon,
      Search: MockIcon,
      SidebarClose: MockIcon,
      Copy: MockIcon,
    },
    Add: MockIcon,
    Close: MockIcon,
    Check: MockIcon,
    BoxDefault: MockIcon,
    BoxChecked: MockIcon,
    Upload: MockIcon,
    Download: MockIcon,
    ChevronUp: MockIcon,
    ChevronDown: MockIcon,
    Filter: MockIcon,
    Logo: MockIcon,
    Search: MockIcon,
    SidebarClose: MockIcon,
    Copy: MockIcon,
  };
});

// 전역으로 mock을 초기화 할 수 있는 함수
(global as any).clearAllTestMocks = () => {
  jest.clearAllMocks();
  mockPush.mockClear();
  mockReplace.mockClear();
  mockBack.mockClear();
  mockRefresh.mockClear();
  mockSetAuthData.mockClear();
  // mockUseAuth 초기화 시 기본값으로 재설정
  mockUseAuth.mockReturnValue({
    setAuthData: mockSetAuthData,
    accessToken: null,
    isAdmin: null,
  });
};

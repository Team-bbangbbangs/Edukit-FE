import '@testing-library/jest-dom';
import { setupMSW } from '@/__tests__/utils/msw-setup';

// 테스트 환경에서 MSW 활성화
process.env.NEXT_PUBLIC_API_MOCKING = 'enabled';
setupMSW();

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
jest.mock('@/shared/providers/auth-provider', () => ({
  useAuth: () => ({
    setAuthData: mockSetAuthData,
    accessToken: null,
    isAdmin: null,
  }),
}));

// 전역 변수로 mock 함수들을 사용할 수 있도록 설정
(global as any).mockPush = mockPush;
(global as any).mockReplace = mockReplace;
(global as any).mockBack = mockBack;
(global as any).mockRefresh = mockRefresh;
(global as any).mockSetAuthData = mockSetAuthData;

// 전역으로 mock을 초기화 할 수 있는 함수
(global as any).clearAllTestMocks = () => {
  jest.clearAllMocks();
  mockPush.mockClear();
  mockReplace.mockClear();
  mockBack.mockClear();
  mockRefresh.mockClear();
  mockSetAuthData.mockClear();
};

/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveValue(value: string | number): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveFocus(): R;
    }
  }

  // 전역 Mock 함수들 타입 정의
  const mockPush: jest.MockedFunction<any>;
  const mockReplace: jest.MockedFunction<any>;
  const mockBack: jest.MockedFunction<any>;
  const mockRefresh: jest.MockedFunction<any>;
  const mockSetAuthData: jest.MockedFunction<any>;
  const mockUseAuth: jest.Mock;

  const clearAllTestMocks: () => void;
}

export {};

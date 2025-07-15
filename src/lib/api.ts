import type { AuthContextProps } from '@/contexts/auth/auth-context';
import { ApiError } from '@/lib/errors';
import type { AuthResponse } from '@/types/api/auth';
import type { ApiResponseWithData } from '@/types/api/response';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  skipTokenRefresh?: boolean;
}

let authContextRef: AuthContextProps | null = null;
let tokenRefreshPromise: Promise<string | null> | null = null;

// AuthProvider에서 Context를 등록하는 함수
export function setAuthContext(context: AuthContextProps) {
  authContextRef = context;
}

// 현재 저장된 토큰을 가져오는 함수
function getCurrentToken(): string | null {
  return authContextRef?.accessToken || null;
}

// URL 파라미터를 추가하는 헬퍼 함수
function addParamsToUrl(url: URL, params?: Record<string, string | number | boolean>) {
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
}

/**
 * 요청 URL을 환경에 맞게 빌드하는 함수
 * 1. MSW 환경에서는 서버/클라이언트 구분이 필요
 *    - 클라이언트: 상대 경로 (/api/v1/users) → MSW가 인터셉트
 *    - 서버: 절대 경로 (http://localhost:9090/api/v1/users) → Mock 서버 직접 호출
 * 2. 프로덕션에서는 실제 API 서버 URL 사용
 */
function buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const isMSWEnabled = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';
  const isServer = typeof window === 'undefined';

  if (isMSWEnabled) {
    if (isServer) {
      const url = new URL(endpoint, 'http://localhost:9090');
      addParamsToUrl(url, params);
      return url.toString();
    } else {
      const url = new URL(endpoint, 'http://localhost');
      addParamsToUrl(url, params);
      return url.pathname + url.search;
    }
  }

  const baseURL = isServer ? process.env.API_URL! : process.env.NEXT_PUBLIC_API_URL!;
  const url = new URL(endpoint, baseURL);
  addParamsToUrl(url, params);
  return url.toString();
}

/**
 * HTTP 헤더를 빌드하는 함수
 * 1. 기본 Content-Type 설정 (FormData가 아닌 경우에만)
 * 2. 사용자 정의 헤더 병합
 * 3. Authorization 헤더 추가 (토큰이 있는 경우)
 */
function buildHeaders(options: FetchOptions): HeadersInit {
  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const token = getCurrentToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * 토큰 갱신을 처리하는 함수
 * 순환 참조 방지하기 위해 직접 fetch를 사용하고, 갱실 실패 시 context값을 비워주면서 로그아웃 상태로 변경
 */
async function refreshAccessToken(): Promise<string | null> {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = (async () => {
    try {
      const url = buildURL('/api/v1/auth/reissue');

      const res = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
      });

      const json: ApiResponseWithData<AuthResponse> = await res.json();

      if (!res.ok) {
        throw new Error(json.message || '유효하지 않은 리프레시 토큰입니다.');
      }

      if (!json.data) {
        throw new Error(json.message || '데이터 fetch 실패');
      }

      const newToken = json.data.accessToken;
      const isAdmin = json.data.isAdmin;

      if (authContextRef) {
        authContextRef.setAuthData(newToken, isAdmin);
      }

      return newToken;
    } catch (error) {
      if (authContextRef) {
        authContextRef.setAuthData(null, null);
      }
      throw error;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
}

/**
 * Response를 파싱하고 에러를 처리하는 함수
 * 1. HTTP 상태 코드 확인
 * 2. JSON 파싱 시도
 * 3. 커스텀 에러 코드가 있으면 ApiError로 변환
 * 4. Response wrapper에서 data 추출
 */
async function handleResponse<T>(response: globalThis.Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (errorData.status && errorData.code) {
      throw new ApiError(errorData.status, errorData.code, errorData.message);
    }

    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();

  if ('data' in json) {
    return json.data as T;
  } else {
    return json as T;
  }
}

/**
 * 공통 fetch 함수
 * 1. 첫 번째 요청 시도
 * 2. 401 에러 발생 시 토큰 갱신 (skipTokenRefresh가 false인 경우에만)
 * 3. 새 토큰으로 동일한 요청 재시도
 */
async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, params, skipTokenRefresh, ...fetchOptions } = options;

  const url = buildURL(endpoint, params);
  const headers = buildHeaders(options);

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  if (body !== undefined) {
    config.body =
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof ArrayBuffer ||
      body instanceof URLSearchParams ||
      typeof body === 'string'
        ? (body as BodyInit)
        : JSON.stringify(body);
  }

  if (typeof window === 'undefined' && !config.cache) {
    config.cache = 'no-store';
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 401 && !skipTokenRefresh) {
      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          const newHeaders = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          } as HeadersInit;

          const retryResponse = await fetch(url, {
            ...config,
            headers: newHeaders,
          });

          return await handleResponse<T>(retryResponse);
        }
      } catch {
        return await handleResponse<T>(response);
      }
    }

    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('네트워크 요청 중 오류가 발생했습니다.');
  }
}

// HTTP 메서드 함수 (get, post, patch, put, delete)
export async function get<T>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) {
  return request<T>(endpoint, { ...options, method: 'GET' });
}

export async function post<T>(
  endpoint: string,
  body?: unknown,
  options: Omit<FetchOptions, 'method' | 'body'> = {},
) {
  return request<T>(endpoint, { ...options, method: 'POST', body });
}

export async function patch<T>(
  endpoint: string,
  body?: unknown,
  options: Omit<FetchOptions, 'method' | 'body'> = {},
) {
  return request<T>(endpoint, { ...options, method: 'PATCH', body });
}

export async function put<T>(
  endpoint: string,
  body?: unknown,
  options: Omit<FetchOptions, 'method' | 'body'> = {},
) {
  return request<T>(endpoint, { ...options, method: 'PUT', body });
}

export async function del<T>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
}

export const api = {
  get,
  post,
  patch,
  put,
  delete: del,
} as const;

import { reissue } from '@/domains/auth/apis/reissue';
import { ApiError } from '@/shared/lib/errors';
import { tokenStore } from '@/shared/lib/token-store';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  skipTokenRefresh?: boolean;
}

// 토큰 갱신 중복 요청 방지를 위한 Promise 캐시
let tokenRefreshPromise: Promise<string | null> | null = null;

// 쿼리 파라미터를 URL에 추가하는 헬퍼 함수
function addQueryParams(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `${url}?${queryString}`;
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
      // MSW 서버: Mock 서버로 직접 요청
      const fullUrl = `http://localhost:9090${endpoint}`;
      return addQueryParams(fullUrl, params);
    } else {
      // MSW 클라이언트: 상대 경로만 필요 (MSW가 인터셉트)
      return addQueryParams(endpoint, params);
    }
  }

  // 실제 API 환경 (서버 컴포넌트인지, 클라이언트 컴포넌트인지에 따라 분기 처리)
  const baseURL = isServer ? process.env.API_URL! : process.env.NEXT_PUBLIC_API_URL!;
  const fullUrl = `${baseURL}${endpoint}`;
  return addQueryParams(fullUrl, params);
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

  const token = tokenStore.getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * 토큰 갱신을 처리하는 함수
 * tokenRefreshPromise를 통해 여러 요청이 동시에 토큰 갱신을 시도할 때, 하나의 요청만 실행하고, 나머지는 같은 Promise를 반환
 * 순환 참조 방지하기 위해 직접 fetch를 사용하고, 갱실 실패 시 context값을 비워주면서 로그아웃 상태로 변경
 */
async function refreshAccessToken(): Promise<string | null> {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = (async () => {
    try {
      const authData = await reissue();

      if (authData) {
        // TokenStore에 새로운 토큰 저장
        tokenStore.setToken(authData.accessToken, authData.isAdmin);
        return authData.accessToken;
      } else {
        // 토큰 갱신 실패 시 로그아웃 처리
        tokenStore.clearToken();
        return null;
      }
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
  return 'data' in json ? (json.data as T) : (json as T);
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
      body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body);
  }

  if (typeof window === 'undefined' && !config.cache) {
    config.cache = 'no-store';
  }

  const response = await fetch(url, config);

  // 401 인터셉터: 토큰 만료 시 자동 갱신 후 재요청
  if (response.status === 401 && !skipTokenRefresh) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      const retryResponse = await fetch(url, {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${newToken}` },
      });
      return await handleResponse<T>(retryResponse);
    }
  }

  return await handleResponse<T>(response);
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

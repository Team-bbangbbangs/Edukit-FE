import type { AuthResponse } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const reissue = async (): Promise<AuthResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reissue`, {
    method: 'PATCH',
    credentials: 'include',
  });

  const json: Response<AuthResponse> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '유효하지 않은 리프레시 토큰입니다.');
  }

  if (!json.data) {
    throw new Error(json.message || '데이터 fetch 실패');
  }

  return json.data;
};

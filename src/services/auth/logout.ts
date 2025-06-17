import type { Response } from '@/types/api/response';

export const logout = async (): Promise<Response<void>> => {
  const res = await fetch('/api/v1/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json: Response<void> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '로그아웃 실패');
  }

  return json;
};

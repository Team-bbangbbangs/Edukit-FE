import type { Response } from '@/types/api/response';

export const logout = async (accessToken: string): Promise<Response<void>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: 'include',
  });

  const json: Response<void> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '로그아웃 실패');
  }

  return json;
};

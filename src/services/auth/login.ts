import type { LoginProp, AuthResponse } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const login = async ({ email, password }: LoginProp): Promise<AuthResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const json: Response<AuthResponse> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '로그인 실패');
  }

  if (!json.data) {
    throw new Error(json.message || '서버에서 로그인 데이터를 받지 못했습니다.');
  }

  return json.data;
};

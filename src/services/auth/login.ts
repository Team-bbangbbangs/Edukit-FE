import type { LoginProp, LoginResponse } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const login = async ({ email, password }: LoginProp): Promise<LoginResponse> => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const json: Response<LoginResponse> = await res.json();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '로그인 실패');
  }

  return json.data;
};

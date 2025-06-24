import type { LoginProp } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const patchResetPassword = async ({
  email,
  password,
}: LoginProp): Promise<Response<null>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '비밀번호 변경 실패');
  }

  return json;
};

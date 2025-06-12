import type { Response } from '@/types/api/response';

export const getVerifyEmail = async (email: string, token: string): Promise<Response<null>> => {
  const res = await fetch(
    `/api/v1/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '이메일 인증에 실패했습니다.');
  }

  const json: Response<null> = await res.json();
  return json;
};

import type { Response } from '@/types/api/response';

export const getVerifyEmail = async (id: string, code: string): Promise<Response<null>> => {
  console.log(id, code);
  const res = await fetch(
    `${process.env.API_URL}/api/v1/auth/verify-email?id=${encodeURIComponent(id)}&code=${encodeURIComponent(code)}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '이메일 인증에 실패했습니다.');
  }

  const json: Response<null> = await res.json();
  return json;
};

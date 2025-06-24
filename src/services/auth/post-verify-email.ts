import type { Response } from '@/types/api/response';

export const postVerifyEmail = async (email: string): Promise<Response<null>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/find-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '이메일 전송 실패');
  }

  return json;
};

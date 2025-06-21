import type { Response } from '@/types/api/response';

export const postSendEmail = async (accessToken: string): Promise<Response<void>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/email/send-verification`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const json: Response<void> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '이메일 전송 실패');
  }

  return json;
};

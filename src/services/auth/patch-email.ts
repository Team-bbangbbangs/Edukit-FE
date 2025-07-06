import type { PatchEmail } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const patchEmail = async ({ email, accessToken }: PatchEmail): Promise<Response<null>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/email`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '이메일 수정 실패');
  }

  return json;
};

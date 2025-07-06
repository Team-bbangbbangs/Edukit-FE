import type { PatchAfterLoginPassword } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const patchAfterLoginPassword = async ({
  currentPassword,
  newPassword,
  accessToken,
}: PatchAfterLoginPassword): Promise<Response<null>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '비밀번호 수정 실패');
  }

  return json;
};

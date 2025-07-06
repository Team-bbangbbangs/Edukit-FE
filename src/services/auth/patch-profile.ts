import type { PatchProfile } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const patchProfile = async ({
  subject,
  school,
  nickname,
  accessToken,
}: PatchProfile): Promise<Response<null>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ subject, school, nickname }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '프로필 수정 실패');
  }

  return json;
};

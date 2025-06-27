import type { PatchAdminNotice } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const patchAdminNotice = async ({
  id,
  categoryId,
  title,
  content,
  accessToken,
}: PatchAdminNotice): Promise<Response<null>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notices/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ categoryId, title, content }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '공지사항 수정 실패');
  }

  return json;
};

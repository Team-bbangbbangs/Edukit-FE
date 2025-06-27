import type { DeleteAdminNotice } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const deleteAdminNotice = async ({
  id,
  accessToken,
}: DeleteAdminNotice): Promise<Response<null>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notices/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '공지사항 삭제 실패');
  }

  return json;
};

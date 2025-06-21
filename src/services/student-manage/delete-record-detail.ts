import type { Response } from '@/types/api/response';
import type { DeleteRecordDetailTypes } from '@/types/api/student-record';

export const deleteRecordDetail = async ({
  recordId,
  accessToken,
}: DeleteRecordDetailTypes): Promise<Response<null>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/${recordId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '학생 기록 삭제 실패');
  }

  return json;
};

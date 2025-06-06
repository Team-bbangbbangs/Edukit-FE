import type { Response } from '@/types/api/response';

export const deleteRecordDetail = async (recordId: string): Promise<Response<null>> => {
  const res = await fetch(`/api/v1/delete-student-record-detail/${recordId}`, { method: 'DELETE' });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '학생 기록 삭제 실패');
  }

  return json;
};

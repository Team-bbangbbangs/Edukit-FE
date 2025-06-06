import type { Response } from '@/types/api/response';
import type { PutRecordDetail } from '@/types/api/student-record';

export const putRecordDetail = async ({
  recordType,
  detailRecord,
}: PutRecordDetail): Promise<Response<null>> => {
  const res = await fetch('/api/v1/put-student-record-detail', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recordType, detailRecord }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '학생 기록 수정 실패');
  }

  return json;
};

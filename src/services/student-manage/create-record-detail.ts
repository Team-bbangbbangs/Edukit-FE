import type { Response } from '@/types/api/response';
import type { CreateRecordDetail } from '@/types/api/student-record';

export const createRecordDetail = async ({
  recordType,
  name,
  studentNumber,
  content,
}: CreateRecordDetail): Promise<Response<null>> => {
  const res = await fetch('/api/v1/create-student-record-detail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recordType, name, studentNumber, content }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '생기부 기록 생성 실패');
  }

  return json;
};

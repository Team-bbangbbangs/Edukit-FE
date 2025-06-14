import type { Response } from '@/types/api/response';
import type { SummaryRecordTypes } from '@/types/api/student-record';

interface PostSummaryRecordDetailParams extends SummaryRecordTypes {
  recordId: number;
}

export const postSummaryRecordDetail = async ({
  recordId,
  description,
  byteCount,
}: PostSummaryRecordDetailParams): Promise<Response<null>> => {
  const res = await fetch(`/api/v1/student-records/detail/${recordId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description, byteCount }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '생기부 종합 작성 실패');
  }

  return json;
};

import type { Response } from '@/types/api/response';
import type { SummaryRecordTypes } from '@/types/api/student-record';

interface PostSummaryRecordDetailParams extends SummaryRecordTypes {
  recordId: number;
  accessToken: string | null;
}

export const postSummaryRecordDetail = async ({
  recordId,
  description,
  byteCount,
  accessToken,
}: PostSummaryRecordDetailParams): Promise<Response<null>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/detail/${recordId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ description, byteCount }),
    },
  );

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '생기부 종합 작성 실패');
  }

  return json;
};

import type { Response } from '@/types/api/response';
import type { SummaryRecordTypes } from '@/types/api/student-record';

export const getSummaryRecordDetail = async (
  recordId: number,
  accessToken: string | null,
): Promise<SummaryRecordTypes> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/detail/${recordId}`,
    {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    },
  );

  const json: Response<SummaryRecordTypes> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '생기부 종합 불러오기 실패');
  }
  if (!json.data) {
    throw new Error('응답에 데이터가 없습니다.');
  }

  return json.data;
};

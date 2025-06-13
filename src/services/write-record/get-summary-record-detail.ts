import type { Response } from '@/types/api/response';
import type { SummaryRecordTypes } from '@/types/api/student-record';

export const getSummaryRecordDetail = async (recordId: number): Promise<SummaryRecordTypes> => {
  const res = await fetch(`/api/v1/student-records/detail/${recordId}`);

  const json: Response<SummaryRecordTypes> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '생기부 종합 작성 실패');
  }
  if (!json.data) {
    throw new Error('응답에 데이터가 없습니다.');
  }

  return json.data;
};

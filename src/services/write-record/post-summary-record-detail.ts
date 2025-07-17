import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/api/response';
import type { SummaryRecordTypes } from '@/types/api/student-record';

interface PostSummaryRecordDetailParams extends SummaryRecordTypes {
  recordId: number;
}

export const postSummaryRecordDetail = async ({
  recordId,
  description,
  byteCount,
}: PostSummaryRecordDetailParams) => {
  return api.post<ApiResponseWithoutData>(`/api/v1/student-records/detail/${recordId}`, {
    description,
    byteCount,
  });
};

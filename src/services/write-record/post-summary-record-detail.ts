import { api } from '@/lib/api';
import type { SummaryRecordRequest } from '@/types/record/record';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const postSummaryRecordDetail = async ({
  recordId,
  description,
  byteCount,
}: SummaryRecordRequest) => {
  return api.post<ApiResponseWithoutData>(`/api/v1/student-records/detail/${recordId}`, {
    description,
    byteCount,
  });
};

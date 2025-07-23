import type { SummaryRecordRequest } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

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

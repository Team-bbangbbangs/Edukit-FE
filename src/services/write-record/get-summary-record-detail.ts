import type { SummaryRecordResponse } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

export const getSummaryRecordDetail = async (recordId: number) => {
  return api.get<SummaryRecordResponse>(`/api/v1/student-records/detail/${recordId}`);
};

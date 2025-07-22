import { api } from '@/lib/api';
import type { SummaryRecordResponse } from '@/types/record/record';

export const getSummaryRecordDetail = async (recordId: number) => {
  return api.get<SummaryRecordResponse>(`/api/v1/student-records/detail/${recordId}`);
};

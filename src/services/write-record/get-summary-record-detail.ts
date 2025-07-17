import { api } from '@/lib/api';
import type { SummaryRecordTypes } from '@/types/api/student-record';

export const getSummaryRecordDetail = async (recordId: number) => {
  return api.get<SummaryRecordTypes>(`/api/v1/student-records/detail/${recordId}`);
};

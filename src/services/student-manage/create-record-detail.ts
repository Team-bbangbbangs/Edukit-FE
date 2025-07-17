import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/api/response';
import type { CreateRecordDetail } from '@/types/api/student-record';

export const createRecordDetail = async ({
  recordType,
  studentRecord,
  semester,
}: CreateRecordDetail) => {
  return api.post<ApiResponseWithoutData>(`/api/v1/student-records/${recordType}/students`, {
    semester,
    studentRecord,
  });
};

import { api } from '@/lib/api';
import type { CreateStudentRecordRequest } from '@/types/record/record';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const createRecordDetail = async ({
  recordType,
  studentRecord,
  semester,
}: CreateStudentRecordRequest) => {
  return api.post<ApiResponseWithoutData>(`/api/v1/student-records/${recordType}/students`, {
    semester,
    studentRecord,
  });
};

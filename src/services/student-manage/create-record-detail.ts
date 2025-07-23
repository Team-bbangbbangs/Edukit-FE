import type { CreateStudentRecordRequest } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

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

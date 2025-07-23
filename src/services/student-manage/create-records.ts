import type { CreateStudentRecordsRequest } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const createRecords = async ({
  recordType,
  studentRecords,
  semester,
}: CreateStudentRecordsRequest) => {
  return api.post<ApiResponseWithoutData>(`/api/v1/student-records/${recordType}/students/batch`, {
    recordType,
    studentRecords,
    semester,
  });
};

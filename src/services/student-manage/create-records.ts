import { api } from '@/lib/api';
import type { CreateStudentRecordsRequest } from '@/types/record/record';
import type { ApiResponseWithoutData } from '@/types/shared/response';

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

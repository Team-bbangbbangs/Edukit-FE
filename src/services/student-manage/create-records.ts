import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/api/response';
import type { CreateRecords } from '@/types/api/student-record';

export const createRecords = async ({ recordType, studentRecords, semester }: CreateRecords) => {
  return api.post<ApiResponseWithoutData>(`/api/v1/student-records/${recordType}/students/batch`, {
    recordType,
    studentRecords,
    semester,
  });
};

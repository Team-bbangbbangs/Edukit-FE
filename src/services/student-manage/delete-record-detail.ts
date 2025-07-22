import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const deleteRecordDetail = async (recordId: string) => {
  return api.delete<ApiResponseWithoutData>(`/api/v1/student-records/${recordId}`);
};

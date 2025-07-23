import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const deleteRecordDetail = async (recordId: string) => {
  return api.delete<ApiResponseWithoutData>(`/api/v1/student-records/${recordId}`);
};

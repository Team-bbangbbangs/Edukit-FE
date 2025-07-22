import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const deleteAdminNotice = async (id: string) => {
  return api.delete<ApiResponseWithoutData>(`/api/v1/admin/notices/${id}`);
};

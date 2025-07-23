import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const deleteAdminNotice = async (id: string) => {
  return api.delete<ApiResponseWithoutData>(`/api/v1/admin/notices/${id}`);
};

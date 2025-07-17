import { api } from '@/lib/api';
import type { AdminNotice } from '@/types/api/notice';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const postAdminNotice = async ({ categoryId, title, content }: AdminNotice) => {
  return api.post<ApiResponseWithoutData>('/api/v1/admin/notices', {
    categoryId,
    title,
    content,
  });
};

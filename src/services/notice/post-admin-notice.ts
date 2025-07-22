import { api } from '@/lib/api';
import type { AdminNoticeBody } from '@/types/notice/notice';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const postAdminNotice = async ({ categoryId, title, content }: AdminNoticeBody) => {
  return api.post<ApiResponseWithoutData>('/api/v1/admin/notices', {
    categoryId,
    title,
    content,
  });
};

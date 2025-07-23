import type { AdminNoticeBody } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const postAdminNotice = async ({ categoryId, title, content }: AdminNoticeBody) => {
  return api.post<ApiResponseWithoutData>('/api/v1/admin/notices', {
    categoryId,
    title,
    content,
  });
};

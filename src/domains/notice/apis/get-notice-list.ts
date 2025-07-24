import type { NoticeListResponse, NoticeListRequest } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';

export const getNoticeList = async ({ page, categoryId }: NoticeListRequest) => {
  return api.get<NoticeListResponse>('/api/v1/notices', {
    params: {
      ...(page && { page }),
      ...(categoryId && { categoryId }),
    },
  });
};

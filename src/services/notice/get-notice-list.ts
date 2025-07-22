import { api } from '@/lib/api';
import type { NoticeListResponse, NoticeListRequest } from '@/types/notice/notice';

export const getNoticeList = async ({ page, categoryId }: NoticeListRequest) => {
  return api.get<NoticeListResponse>('/api/v1/notices', {
    params: {
      ...(page && { page }),
      ...(categoryId && { categoryId }),
    },
  });
};

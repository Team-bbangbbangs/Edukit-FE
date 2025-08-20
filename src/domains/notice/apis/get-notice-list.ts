import type { NoticeListResponse, NoticeListRequest } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';

export const getNoticeList = async ({ page, category }: NoticeListRequest) => {
  return api.get<NoticeListResponse>('/api/v2/notices', {
    params: {
      ...(page && { page }),
      ...(category && { category }),
    },
  });
};

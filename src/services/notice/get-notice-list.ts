import { api } from '@/lib/api';
import type { NoticeResponse } from '@/types/api/notice';

export const getNoticeList = async ({
  page,
  categoryId,
}: {
  page?: string;
  categoryId?: string;
} = {}) => {
  return api.get<NoticeResponse>('/api/v1/notices', {
    params: {
      ...(page && { page }),
      ...(categoryId && { categoryId }),
    },
  });
};

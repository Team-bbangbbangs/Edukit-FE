import type { DetailNoticeResponse } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';

export const getNoticeDetail = async (id: string) => {
  return api.get<DetailNoticeResponse>(`/api/v1/notices/${id}`);
};

import { api } from '@/lib/api';
import type { DetailNoticeResponse } from '@/types/notice/notice';

export const getNoticeDetail = async (id: string) => {
  return api.get<DetailNoticeResponse>(`/api/v1/notices/${id}`);
};

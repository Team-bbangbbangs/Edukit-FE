import { api } from '@/lib/api';
import type { DetailNoticeType } from '@/types/api/notice';

export const getNoticeDetail = async (id: string) => {
  return api.get<DetailNoticeType>(`/api/v1/notices/${id}`);
};

import type { DetailNoticeResponse } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';

export const getNoticeDetail = async (noticeId: number) => {
  return api.get<DetailNoticeResponse>(`/api/v2/notices/${noticeId}`);
};

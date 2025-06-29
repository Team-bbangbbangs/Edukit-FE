import type { DetailNoticeType } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const getNoticeDetail = async (id: string) => {
  const url = `${process.env.API_URL}/api/v1/notices/${id}`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  const json: Response<DetailNoticeType> = await res.json();

  if (!json.data) {
    throw new Error('공지사항을 찾을 수 없습니다.');
  }

  return json.data;
};

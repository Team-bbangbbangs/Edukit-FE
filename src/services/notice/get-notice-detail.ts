import type { DetailNoticeType } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const getNoticeDetail = async (id: string) => {
  const url = `http://localhost:9090/api/notice/${id}`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  const json: Response<DetailNoticeType> = await res.json();

  return json;
};

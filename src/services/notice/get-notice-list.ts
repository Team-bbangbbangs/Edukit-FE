import type { NoticeResponse } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const getNoticeList = async ({
  page,
  categoryId,
}: {
  page?: string;
  categoryId?: string;
}) => {
  const query: Record<string, string> = {};
  if (page) {
    query.page = page;
  }
  if (categoryId) {
    query.categoryId = categoryId;
  }

  const param = new URLSearchParams(query).toString();

  const url =
    param.length === 0
      ? `${process.env.API_URL}/api/v1/notices`
      : `${process.env.API_URL}/api/v1/notices?${param}`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  const json: Response<NoticeResponse> = await res.json();

  return json.data;
};

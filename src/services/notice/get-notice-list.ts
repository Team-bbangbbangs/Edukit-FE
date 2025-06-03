import type { NoticeResponse } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const getNoticeList = async ({ page, tagId }: { page?: string; tagId?: string }) => {
  const query: Record<string, string> = {};
  if (page) {
    query.page = page;
  }
  if (tagId) {
    query.tagId = tagId;
  }

  const param = new URLSearchParams(query).toString();

  const url =
    param.length === 0
      ? `http://localhost:9090/api/notice`
      : `http://localhost:9090/api/notice?${param}`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  const json: Response<NoticeResponse> = await res.json();

  return json;
};

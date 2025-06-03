import { http, HttpResponse } from 'msw';

import type { NoticeType, NoticeResponse } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

const tags = ['공지', '이벤트'] as const;

const notices: NoticeType[] = Array.from({ length: 80 }, (_, i) => ({
  id: `${i + 1}`,
  tag: tags[i % tags.length],
  title: `공지사항 제목 ${i + 1}`,
  createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
}));

export const getNoticeList = [
  http.get('/api/notice', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const tagParam = url.searchParams.get('tagId');

    const tagByNumber: Record<string, string> = { '2': '공지', '3': '이벤트' };
    const tag = tagByNumber[tagParam || ''] || '';

    let filtered = notices;
    if (tag) {
      filtered = filtered.filter((n) => n.tag === tag);
    }

    filtered = filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    const response: Response<NoticeResponse> = {
      status: 200,
      code: 'EDMT-20002',
      message: '요청에 성공했습니다.',
      data: {
        NoticeList: paginated,
        maxPage: 8,
      },
    };

    return HttpResponse.json(response);
  }),
];

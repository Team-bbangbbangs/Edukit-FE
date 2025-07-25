import { http, HttpResponse } from 'msw';

import type { Notice } from '@/domains/notice/types/notice';

const tags = ['공지', '이벤트'] as const;

const notices: Notice[] = Array.from({ length: 80 }, (_, i) => ({
  noticeId: `${i + 1}`,
  category: tags[i % tags.length],
  title: `공지사항 제목 ${i + 1}`,
  createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
}));

const PAGE_SIZE = 10;
const CATEGORY_MAP: Record<string, string> = { '2': '공지', '3': '이벤트' };

export const getNoticeList = [
  http.get('/api/v1/notices', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const categoryParam = url.searchParams.get('categoryId') ?? '';

    if (categoryParam && categoryParam !== '2' && categoryParam !== '3') {
      return HttpResponse.json(
        {
          status: 400,
          code: 'EDMT-4000301',
          message: '유효하지 않은 공지사항 카테고리입니다.',
        },
        { status: 400 },
      );
    }

    const categoryFilter = CATEGORY_MAP[categoryParam] ?? '';

    const filteredNotices = categoryFilter
      ? notices.filter((notice) => notice.category === categoryFilter)
      : notices;

    const sortedNotices = filteredNotices.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const startIdx = (page - 1) * PAGE_SIZE;
    const paginatedNotices = sortedNotices.slice(startIdx, startIdx + PAGE_SIZE);

    const totalPages = Math.ceil(filteredNotices.length / PAGE_SIZE);

    return HttpResponse.json(
      {
        status: 200,
        code: 'EDMT-20002',
        message: '요청에 성공했습니다.',
        data: {
          notices: paginatedNotices,
          totalPages,
        },
      },
      { status: 200 },
    );
  }),
];

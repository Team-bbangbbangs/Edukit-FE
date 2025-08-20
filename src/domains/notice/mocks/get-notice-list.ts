import { http, HttpResponse } from 'msw';

import type { Notice, NoticeCategoryType, NoticeTagType } from '@/domains/notice/types/notice';

const tags = ['공지', '이벤트'] as const;

const notices: Notice[] = Array.from({ length: 80 }, (_, i) => ({
  noticeId: i + 1,
  category: tags[i % tags.length],
  title: `공지사항 제목 ${i + 1}`,
  createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
}));

const PAGE_SIZE = 10;
const CATEGORY_MAP: Record<NoticeCategoryType, NoticeTagType> = {
  announcement: '공지',
  event: '이벤트',
};

function isValidCategory(category: string): category is NoticeCategoryType {
  return category === 'announcement' || category === 'event';
}

export const getNoticeList = [
  http.get('/api/v2/notices', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const categoryParam = url.searchParams.get('category') ?? '';

    if (categoryParam && !isValidCategory(categoryParam)) {
      return HttpResponse.json(
        {
          code: 'NO-40001',
          message: '유효하지 않은 공지사항 카테고리입니다.',
        },
        { status: 200 },
      );
    }

    if (page < 1) {
      return HttpResponse.json(
        {
          code: 'FAIL-400',
          message: 'validation 오류',
          data: {
            page: '1 이상이어야 합니다',
          },
        },
        { status: 200 },
      );
    }

    const categoryFilter =
      categoryParam && isValidCategory(categoryParam) ? CATEGORY_MAP[categoryParam] : '';

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
        code: 'SUCCESS',
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

import { http, HttpResponse } from 'msw';

import type { DetailNoticeResponse } from '@/domains/notice/types/notice';

const tags = ['공지', '이벤트'] as const;

const notices: DetailNoticeResponse[] = Array.from({ length: 80 }, (_, i) => {
  const contentLength = 100 + (i % 5) * 50;
  const content = `공지사항 내용 ${i + 1} `.repeat(contentLength / 20);

  return {
    noticeId: i + 1,
    category: tags[i % tags.length],
    title: `공지사항 제목 ${i + 1}`,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    content,
    noticeFileKeys: ['1', '2', '3'],
  };
});

export const getNoticeDetail = [
  http.get('/api/v2/notices/:noticeId', ({ params }) => {
    const { noticeId } = params;
    const notice = notices.find((n) => n.noticeId === Number(noticeId));

    if (!notice) {
      return HttpResponse.json(
        {
          code: 'NO-40402',
          message: '해당 공지사항이 존재하지 않습니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
        data: notice,
      },
      { status: 200 },
    );
  }),
];

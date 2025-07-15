import { http, HttpResponse } from 'msw';

import type { DetailNoticeType } from '@/types/api/notice';

const tags = ['공지', '이벤트'] as const;

const notices: DetailNoticeType[] = Array.from({ length: 80 }, (_, i) => {
  const contentLength = 100 + (i % 5) * 50;
  const content = `공지사항 내용 ${i + 1} `.repeat(contentLength / 20);

  return {
    noticeId: `${i + 1}`,
    category: tags[i % tags.length],
    title: `공지사항 제목 ${i + 1}`,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    content,
  };
});

export const getNoticeDetail = [
  http.get('/api/v1/notices/:noticeId', ({ params }) => {
    const { noticeId } = params;
    const notice = notices.find((n) => n.noticeId === noticeId);

    if (!notice) {
      return HttpResponse.json(
        {
          status: 404,
          code: 'EDMT-4040301',
          message: '해당 공지사항이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }

    const response = {
      status: 200,
      code: 'EDMT-200',
      message: '요청이 성공했습니다.',
      data: notice,
    };

    return HttpResponse.json(response);
  }),
];

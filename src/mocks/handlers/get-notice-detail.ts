import { http, HttpResponse } from 'msw';

import type { DetailNoticeType } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

const tags = ['공지', '이벤트'] as const;

const notices: DetailNoticeType[] = Array.from({ length: 80 }, (_, i) => {
  const contentLength = 100 + (i % 5) * 50;
  const content = `공지사항 내용 ${i + 1} `.repeat(contentLength / 20);

  return {
    id: `${i + 1}`,
    tag: tags[i % tags.length],
    title: `공지사항 제목 ${i + 1}`,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    content,
  };
});

export const getNoticeDetail = [
  http.get('/api/notice/:noticeId', ({ params }) => {
    const { noticeId } = params;
    const notice = notices.find((n) => n.id === noticeId);

    if (!notice) {
      const errorResponse: Response<null> = {
        status: 404,
        code: 'EDMT-401',
        message: '해당 공지사항을 찾을 수 없습니다.',
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    const response: Response<DetailNoticeType> = {
      status: 200,
      code: 'EDMT-200',
      message: '공지사항 상세 정보를 가져왔습니다.',
      data: notice,
    };

    return HttpResponse.json(response);
  }),
];

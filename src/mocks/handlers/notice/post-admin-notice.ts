import { http, HttpResponse } from 'msw';

import type { AdminNoticeRequest } from '@/types/api/notice';

export const postAdminNotice = [
  http.post('/api/v1/admin/notices', async ({ request }) => {
    const body = (await request.json()) as AdminNoticeRequest;

    if (body.categoryId !== 2 && body.categoryId !== 3) {
      return HttpResponse.json(
        {
          status: 400,
          code: 'EDMT-4000302',
          message: '공지사항 작성이 허용되지 않는 카테고리입니다.',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-20000',
      message: '요청이 성공했습니다.',
    });
  }),
];

import { http, HttpResponse } from 'msw';

import { checkAccessToken } from '@/mocks/utils/check-access-token';
import type { AdminNotice } from '@/types/api/notice';

export const postAdminNotice = [
  http.post('/api/v1/admin/notices', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    const validation = checkAccessToken(authHeader);

    if (!validation.tokenData?.isAdmin) {
      return HttpResponse.json(
        {
          status: 403,
          code: 'EDMT-403',
          message: '관리자 권한이 필요합니다.',
        },
        { status: 403 },
      );
    }

    const body = (await request.json()) as AdminNotice;

    if (!body.title?.trim() || !body.content?.replace(/<[^>]*>/g, '').trim()) {
      return HttpResponse.json(
        {
          status: 400,
          code: 'EDMT-400',
          message: '제목과 내용을 모두 입력해주세요.',
        },
        { status: 400 },
      );
    }

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

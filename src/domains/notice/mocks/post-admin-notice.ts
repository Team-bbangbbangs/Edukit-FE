import { http, HttpResponse } from 'msw';

import type { AdminNoticeBody } from '@/domains/notice/types/notice';
import { checkAccessToken } from '@/shared/mocks/utils/check-access-token';

export const postAdminNotice = [
  http.post('/api/v2/admin/notices', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    const validation = checkAccessToken(authHeader);

    if (!validation.tokenData?.isAdmin) {
      return HttpResponse.json(
        {
          code: 'A-40304',
          message: '접근 권한이 없는 사용자입니다. 교사 인증을 진행해주세요.',
        },
        { status: 200 },
      );
    }

    const body = (await request.json()) as AdminNoticeBody;

    if (!body.title?.trim() || !body.content?.replace(/<[^>]*>/g, '').trim()) {
      return HttpResponse.json(
        {
          code: 'FAIL-400',
          message: 'validation 오류',
          data: {
            category: '카테고리는 필수입니다.',
            title: '제목은 필수입니다.',
            content: '내용은 필수입니다.',
          },
        },
        { status: 200 },
      );
    }

    if (body.category !== 'announcement' && body.category !== 'event') {
      return HttpResponse.json(
        {
          code: 'NO-40001',
          message: '유효하지 않은 공지사항 카테고리입니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
      },
      { status: 200 },
    );
  }),
];

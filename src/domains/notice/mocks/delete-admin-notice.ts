import { http, HttpResponse } from 'msw';

import { checkAccessToken } from '@/shared/mocks/utils/check-access-token';

export const deleteAdminNotice = [
  http.delete('/api/v2/admin/notices/:noticeId', ({ request, params }) => {
    const { noticeId } = params;

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

    if (noticeId === '999') {
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
        message: '요청이 성공했습니다.',
      },
      { status: 200 },
    );
  }),
];

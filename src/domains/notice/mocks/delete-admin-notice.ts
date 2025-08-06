import { http, HttpResponse } from 'msw';

import { checkAccessToken } from '@/shared/mocks/utils/check-access-token';

export const deleteAdminNotice = [
  http.delete('/api/v1/admin/notices/:noticeId', ({ request, params }) => {
    const { noticeId } = params;

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

    if (noticeId === '999') {
      return HttpResponse.json(
        {
          status: 404,
          code: 'EDMT-4040301',
          message: '해당 공지사항이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-20000',
      message: '요청이 성공했습니다.',
    });
  }),
];

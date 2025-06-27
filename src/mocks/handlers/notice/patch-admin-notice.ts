import { http, HttpResponse } from 'msw';

export const patchAdminNotice = [
  http.patch('/api/v1/admin/notices:id', async ({ params }) => {
    const { noticeId } = params;

    if (noticeId === '10') {
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

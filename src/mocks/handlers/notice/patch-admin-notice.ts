import { http, HttpResponse } from 'msw';

export const patchAdminNotice = [
  http.patch('/api/v1/admin/notices/:noticeId', async ({ request, params }) => {
    const { noticeId } = params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.includes('admin-access-token')) {
      return HttpResponse.json(
        {
          status: 403,
          code: 'EDMT-403',
          message: '관리자 권한이 필요합니다.',
        },
        { status: 403 },
      );
    }

    const body = (await request.json()) as {
      categoryId: number;
      title: string;
      content: string;
    };

    if (!body.title?.trim() || !body.content?.trim()) {
      return HttpResponse.json(
        {
          status: 400,
          code: 'EDMT-400',
          message: '제목과 내용을 모두 입력해주세요.',
        },
        { status: 400 },
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
      data: null,
    });
  }),
];

import { http, HttpResponse } from 'msw';

export const reissue = [
  http.patch('/api/v1/auth/reissue', () => {
    return HttpResponse.json({
      status: 200,
      code: 'EDMT-200',
      message: '요청이 성공했습니다.',
      data: {
        accessToken: 'new-access-token',
      },
    });
  }),
];

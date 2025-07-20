import { http, HttpResponse } from 'msw';

export const postLogout = [
  http.post('/api/v1/auth/logout', async () => {
    return HttpResponse.json(
      {
        status: 200,
        code: 'EDMT-20002',
        message: '로그아웃이 완료되었습니다.',
      },
      {
        status: 200,
        headers: {
          'Content-type': 'application/json',
          'Set-Cookie': 'refreshToken=; HttpOnly; Path=/; SameSite=Lax',
        },
      },
    );
  }),
];

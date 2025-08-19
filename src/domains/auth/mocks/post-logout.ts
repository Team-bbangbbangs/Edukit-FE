import { http, HttpResponse } from 'msw';

export const postLogout = [
  http.post('/api/v1/auth/logout', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
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

import { http, HttpResponse } from 'msw';

export const deleteWithdraw = [
  http.delete('/api/v1/users/withdraw', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '성공 메세지 작성',
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

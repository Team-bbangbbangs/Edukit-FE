import { http, HttpResponse } from 'msw';

export const deleteWithdraw = [
  http.delete('/api/v1/users/withdraw', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
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

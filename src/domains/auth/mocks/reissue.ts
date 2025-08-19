import { http, HttpResponse } from 'msw';

export const reissue = [
  http.patch('/api/v1/auth/reissue', ({ cookies }) => {
    const refreshToken = cookies['refreshToken'];

    let isAdmin = false;
    let accessToken = 'user-access-token';

    const expiresAt = Date.now() + 30 * 60 * 1000;

    if (refreshToken === 'admin-refresh-token') {
      isAdmin = true;
      accessToken = `admin-access-token.${expiresAt}`;
    } else if (refreshToken === 'user-refresh-token') {
      isAdmin = false;
      accessToken = `user-access-token.${expiresAt}`;
    } else if (refreshToken === 'email-not-verified-user-refresh-token') {
      isAdmin = false;
      accessToken = `email-not-verified-user-access-token.${expiresAt}`;
    } else {
      return HttpResponse.json(
        {
          code: 'A-40102',
          message: '유효하지 않은 토큰입니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
        data: { accessToken, isAdmin },
      },
      { status: 200 },
    );
  }),
];

import { http, HttpResponse } from 'msw';

export const patchProfile = [
  http.patch('/api/v1/users/profile', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
      },
      { status: 200 },
    );
  }),
];

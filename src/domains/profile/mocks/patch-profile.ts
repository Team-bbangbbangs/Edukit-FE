import { http, HttpResponse } from 'msw';

export const patchProfile = [
  http.patch('/api/v1/users/profile', async () => {
    return HttpResponse.json({
      status: 200,
      code: 'EDMT-200',
      message: '요청에 성공했습니다.',
    });
  }),
];

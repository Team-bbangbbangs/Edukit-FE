import { http, HttpResponse } from 'msw';

export const patchStudents = [
  http.patch('/api/v1/students/:studentId', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
      },
      { status: 200 },
    );
  }),
];

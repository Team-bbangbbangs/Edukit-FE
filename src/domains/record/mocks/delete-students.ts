import { http, HttpResponse } from 'msw';

export const deleteStudents = [
  http.delete('/api/v1/students', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
      },
      { status: 200 },
    );
  }),
];

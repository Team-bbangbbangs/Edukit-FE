import { http, HttpResponse } from 'msw';

export const aiGenerate = [
  http.post('/api/v2/student-records/ai-generate/:recordId', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
        data: {
          taskId: '123',
        },
      },
      { status: 200 },
    );
  }),
];

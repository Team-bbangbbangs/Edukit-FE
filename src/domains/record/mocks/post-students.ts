import { http, HttpResponse } from 'msw';

import { type Student } from '@/domains/record/types/record';

export const postStudents = [
  http.post('/api/v1/students', async ({ request }) => {
    const body = (await request.json()) as Student;

    if (body.grade === 1 && body.classNumber === 1 && body.studentNumber === 1) {
      return HttpResponse.json(
        {
          code: 'ST-40905',
          message: '이미 등록된 학생입니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
      },
      { status: 200 },
    );
  }),
];

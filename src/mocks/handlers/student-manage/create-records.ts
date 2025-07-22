import { http, HttpResponse } from 'msw';

import type { CreateStudentRecordsRequest } from '@/types/record/record';

export const createRecords = [
  http.post('/api/v1/student-records/:recordType/students/batch', async ({ request }) => {
    const body = (await request.json()) as CreateStudentRecordsRequest;

    if (!body || !Array.isArray(body.studentRecords) || body.studentRecords.length === 0) {
      return HttpResponse.json(
        { status: 400, code: 'EDMT-40001', message: '잘못된 요청 데이터' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-20000',
      message: '학생 기록이 성공적으로 등록되었습니다.',
    });
  }),
];

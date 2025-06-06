import { http, HttpResponse } from 'msw';

import type { CreateRecordDetail } from '@/types/api/student-record';

export const createRecordDetail = [
  http.post('/api/v1/create-student-record-detail', async ({ request }) => {
    const body = (await request.json()) as CreateRecordDetail;

    if (!body) {
      return HttpResponse.json(
        { status: 400, code: 'EDMT-40001', message: '잘못된 요청 데이터입니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-20000',
      message: '데이터가 성공적으로 생성되었습니다.',
    });
  }),
];

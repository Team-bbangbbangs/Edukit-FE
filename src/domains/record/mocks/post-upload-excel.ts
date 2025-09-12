import { http, HttpResponse } from 'msw';

export const postUploadExcel = [
  http.post('/api/v1/students/excel', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
        data: {
          successCount: 23,
          failCount: 2,
          invalidRows: [
            { rowNumber: 5, grade: 1, classNumber: 1, studentNumber: 1, name: '홍길동' },
            { rowNumber: 5, grade: 1, classNumber: 1, studentNumber: 1, name: '홍길동' },
          ],
        },
      },
      { status: 200 },
    );
  }),
];

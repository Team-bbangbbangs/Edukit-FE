import { http, HttpResponse } from 'msw';

export const postUploadExcel = [
  http.post('/api/v1/student/excel', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '학생 목록이 성공적으로 업로드되었습니다.',
        data: {
          uploadedCount: 25,
          successCount: 23,
          failCount: 2,
          failedStudents: [
            { rowNumber: 5, grade: '1', classNumber: '1', studentNumber: '1', name: '홍길동' },
            { rowNumber: 5, grade: '1', classNumber: '1', studentNumber: '1', name: '홍길동' },
          ],
        },
      },
      { status: 200 },
    );
  }),
];

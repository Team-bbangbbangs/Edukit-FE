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
            { row: 5, name: '홍길동', reason: '중복된 학생 정보입니다.' },
            { row: 12, name: '김철수', reason: '필수 정보가 누락되었습니다.' },
          ],
        },
      },
      { status: 200 },
    );
  }),
];

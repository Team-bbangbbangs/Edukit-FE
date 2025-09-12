import { http, HttpResponse } from 'msw';

import type { RecordType } from '@/domains/record/types/record';
import { checkAccessToken } from '@/shared/mocks/utils/check-access-token';

const generateStudentsNameData = (recordType: RecordType) => {
  const studentNames = [];
  const grades = [1, 2, 3];
  const classNumbers = [1, 2, 3];

  const studentCounts: Record<RecordType, number> = {
    subject: 50,
    behavior: 30,
    career: 25,
    free: 20,
    club: 35,
  };

  const count = studentCounts[recordType] || 30;

  for (let i = 1; i <= count; i++) {
    studentNames.push({
      recordId: i,
      studentName: `${recordType.toLowerCase()}_학생${i}`,
    });
  }

  return {
    grades,
    classNumbers,
    studentNames,
  };
};

export const getStudentsName = [
  http.get<{ recordType: RecordType }, never>(
    '/api/v1/students/:recordType',
    ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');
      const validation = checkAccessToken(authHeader);

      if (!validation.isValid) {
        return HttpResponse.json(
          {
            code: 'A-40101',
            message: '토큰이 누락되었습니다.',
          },
          { status: 401 },
        );
      }

      if (validation.isExpired) {
        return HttpResponse.json(
          {
            code: 'A-40102',
            message: '만료된 토큰입니다.',
          },
          { status: 401 },
        );
      }

      if (validation.isNotVerified) {
        return HttpResponse.json(
          {
            code: 'A-40304',
            message: '접근 권한이 없는 사용자입니다. 교사 인증을 진행해주세요.',
          },
          { status: 403 },
        );
      }

      const { recordType } = params;
      const url = new URL(request.url);

      const grade = url.searchParams.get('grade');
      const classNumber = url.searchParams.get('classNumber');
      const studentName = url.searchParams.get('studentName');

      const mockData = generateStudentsNameData(recordType);

      if (grade) {
        mockData.studentNames = mockData.studentNames.filter((_, index) => {
          const studentGrade = Math.floor(index / 20) + 1;
          return studentGrade === Number(grade);
        });
      }

      if (classNumber) {
        mockData.studentNames = mockData.studentNames.filter((_, index) => {
          const studentClass = (index % 3) + 1;
          return studentClass === Number(classNumber);
        });
      }

      if (studentName) {
        mockData.studentNames = mockData.studentNames.filter((student) =>
          student.studentName.includes(studentName),
        );
      }

      return HttpResponse.json(
        {
          code: 'SUCCESS',
          message: '요청이 성공했습니다.',
          data: mockData,
        },
        { status: 200 },
      );
    },
  ),
];

import { http, HttpResponse } from 'msw';

import type { Student, RecordType } from '@/domains/record/types/record';

const generateMockStudent = (): Student[] => {
  const students: Student[] = [];
  const recordTypeOptions: RecordType[][] = [
    ['subject'],
    ['behavior'],
    ['subject', 'behavior'],
    ['career'],
    ['free'],
    ['club'],
    ['subject', 'career'],
    ['behavior', 'free'],
    ['career', 'club'],
    ['subject', 'behavior', 'career'],
    [],
  ];

  for (let i = 1; i <= 120; i++) {
    const grade = Math.floor((i - 1) / 40) + 1;
    const classNumber = Math.floor(((i - 1) % 40) / 10) + 1;
    const studentNumber = ((i - 1) % 10) + 1;

    students.push({
      studentId: i,
      grade,
      classNumber,
      studentNumber,
      studentName: `학생${i}`,
      recordTypes: recordTypeOptions[i % recordTypeOptions.length],
    });
  }

  return students;
};

const MOCK_STUDENTS = generateMockStudent();

export const getStudents = [
  http.get('/api/v1/students', ({ request }) => {
    const url = new URL(request.url);

    const grades = url.searchParams.getAll('grades').map(Number);
    const classNumbers = url.searchParams.getAll('classNumbers').map(Number);
    const recordTypes = url.searchParams.getAll('recordTypes') as RecordType[];
    const lastStudentId = url.searchParams.get('lastStudentId');
    const pageSize = 20;

    let filteredStudents = [...MOCK_STUDENTS];

    if (grades.length > 0) {
      filteredStudents = filteredStudents.filter((student) => grades.includes(student.grade));
    }

    if (classNumbers.length > 0) {
      filteredStudents = filteredStudents.filter((student) =>
        classNumbers.includes(student.classNumber),
      );
    }

    if (recordTypes.length > 0) {
      filteredStudents = filteredStudents.filter((student) =>
        recordTypes.some((recordType) => student.recordTypes.includes(recordType)),
      );
    }

    let startIndex = 0;
    if (lastStudentId) {
      const lastIndex = filteredStudents.findIndex(
        (student) => student.studentId === parseInt(lastStudentId),
      );
      startIndex = lastIndex + 1;
    }

    const paginatedStudents = filteredStudents.slice(startIndex, startIndex + pageSize);

    const availableGrades = [...new Set(MOCK_STUDENTS.map((s) => s.grade))].sort((a, b) => a - b);
    const availableClasses = [...new Set(MOCK_STUDENTS.map((s) => s.classNumber))].sort(
      (a, b) => a - b,
    );

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
        data: {
          studentCount: filteredStudents.length,
          grades: availableGrades,
          classNumbers: availableClasses,
          students: paginatedStudents,
        },
      },
      { status: 200 },
    );
  }),
];

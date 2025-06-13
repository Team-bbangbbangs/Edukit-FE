import type { RecordType, StudentNameTypes } from '@/types/api/student-record';

const getRandomStudentName = () => {
  const lastNameArr = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const nameArr = ['민수', '서연', '지훈', '예은', '준영', '수빈', '하늘', '다은', '지우', '현우'];

  const lastName = lastNameArr[Math.floor(Math.random() * lastNameArr.length)];
  const name = nameArr[Math.floor(Math.random() * nameArr.length)];

  return lastName + name;
};

export const STUDENT_NAME_DATA: Record<RecordType, StudentNameTypes[]> = {
  career: Array.from({ length: 30 }, (_, i) => ({
    recordId: i + 1,
    studentName: getRandomStudentName(),
  })),
  subject: Array.from({ length: 2 }, (_, i) => ({
    recordId: i + 1,
    studentName: getRandomStudentName(),
  })),
  behavior: [],
  free: Array.from({ length: 5 }, (_, i) => ({
    recordId: i + 1,
    studentName: getRandomStudentName(),
  })),
  club: Array.from({ length: 10 }, (_, i) => ({
    recordId: i + 1,
    studentName: getRandomStudentName(),
  })),
};

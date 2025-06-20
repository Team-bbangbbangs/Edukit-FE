import type { RecordType, StudentRecord } from '@/types/api/student-record';

export const RECORD_DATA: Record<RecordType, StudentRecord[]> = {
  career: Array.from({ length: 100 }, (_, i) => ({
    recordDetailId: `career-${i + 1}`,
    studentNumber: `21-${Math.floor(Math.random() * 100000000)}`,
    studentName: `학생${i + 1}`,
    content: '진로 기록 예시: 책임감 있고 성실한 학생입니다.',
  })),
  subject: Array.from({ length: 40 }, (_, i) => ({
    recordDetailId: `subject-${i + 1}`,
    studentNumber: `21-${Math.floor(Math.random() * 100000000)}`,
    studentName: `학생${i + 1}`,
    content: '과목별 성취 기록 예시: 도전적이고 자기주도적 학습 태도를 보입니다.',
  })),
  behavior: [],
  free: Array.from({ length: 5 }, (_, i) => ({
    recordDetailId: `free-${i + 1}`,
    studentNumber: `21-${Math.floor(Math.random() * 100000000)}`,
    studentName: `학생${i + 1}`,
    content: '자유기록 예시: 창의적이고 다양한 활동에 참여합니다.',
  })),
  club: Array.from({ length: 20 }, (_, i) => ({
    recordDetailId: `club-${i + 1}`,
    studentNumber: `21-${Math.floor(Math.random() * 100000000)}`,
    studentName: `학생${i + 1}`,
    content: '동아리 활동 예시: 열정적으로 참여하고 리더십을 발휘합니다.',
  })),
};

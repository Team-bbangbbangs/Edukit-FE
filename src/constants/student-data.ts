import type { RecordType } from '@/types/api/student-record';
import { calculateByte } from '@/util/calculate-byte';

type MockStudentData = {
  recordId: number;
  studentName: string;
  description: string;
  byteCount: number;
};

const getRandomStudentName = () => {
  const lastNameArr = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const nameArr = ['민수', '서연', '지훈', '예은', '준영', '수빈', '하늘', '다은', '지우', '현우'];

  const lastName = lastNameArr[Math.floor(Math.random() * lastNameArr.length)];
  const name = nameArr[Math.floor(Math.random() * nameArr.length)];

  return lastName + name;
};

const getRandomDescription = () => {
  const descriptions = [
    '이 학생은 바른 태도로 수업에 임합니다.',
    '이 학생은 성실한 태도로 수업에 임합니다.',
    '이 학생은 적극적인 태도로 수업에 임합니다.',
    '이 학생은 책임감 있는 태도로 수업에 임합니다.',
    '수업 시간에 적극적으로 참여하며 질문을 자주 합니다.',
    '과제를 성실히 수행하고 기한을 잘 지킵니다.',
    '친구들과 협력하여 팀 프로젝트를 잘 진행합니다.',
    '창의적인 아이디어를 제시하며 문제 해결에 뛰어납니다.',
    '규칙을 잘 지키고 타인을 배려하는 모습을 보입니다.',
    '리더십을 발휘하여 동급생들을 잘 이끕니다.',
    '',
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

export const STUDENT_DATA: Record<RecordType, MockStudentData[]> = {
  career: [
    {
      recordId: 1,
      studentName: '김민수',
      description:
        '진로 상담을 통해 자신의 꿈을 구체화하고 있으며, 관련 분야에 대한 탐구 활동을 적극적으로 수행하고 있습니다.',
      byteCount: calculateByte(
        '진로 상담을 통해 자신의 꿈을 구체화하고 있으며, 관련 분야에 대한 탐구 활동을 적극적으로 수행하고 있습니다.',
      ),
    },
    {
      recordId: 2,
      studentName: '이서연',
      description: '다양한 직업 체험 활동에 참여하며 자신의 적성을 찾아가고 있습니다.',
      byteCount: calculateByte('다양한 직업 체험 활동에 참여하며 자신의 적성을 찾아가고 있습니다.'),
    },
    {
      recordId: 3,
      studentName: '윤다은',
      description:
        '진로 포트폴리오를 성실히 작성하고 있으며, 미래 계획을 체계적으로 세우고 있습니다.',
      byteCount: calculateByte(
        '진로 포트폴리오를 성실히 작성하고 있으며, 미래 계획을 체계적으로 세우고 있습니다.',
      ),
    },
    {
      recordId: 4,
      studentName: '이승섭',
      description: '',
      byteCount: calculateByte(''),
    },
    {
      recordId: 5,
      studentName: '이승섭1',
      description:
        '진로 멘토링 프로그램에 적극 참여하며 선배들과의 네트워킹을 활발히 하고 있습니다.',
      byteCount: calculateByte(
        '진로 멘토링 프로그램에 적극 참여하며 선배들과의 네트워킹을 활발히 하고 있습니다.',
      ),
    },
    {
      recordId: 6,
      studentName: '이승섭2',
      description: '창업 동아리 활동을 통해 기업가 정신을 기르고 있습니다.',
      byteCount: calculateByte('창업 동아리 활동을 통해 기업가 정신을 기르고 있습니다.'),
    },
  ],
  subject: Array.from({ length: 8 }, (_, i) => {
    const description = getRandomDescription();
    return {
      recordId: 100 + i,
      studentName: getRandomStudentName(),
      description,
      byteCount: calculateByte(description),
    };
  }),
  behavior: [],
  free: Array.from({ length: 5 }, (_, i) => {
    const description = getRandomDescription();
    return {
      recordId: 300 + i,
      studentName: getRandomStudentName(),
      description,
      byteCount: calculateByte(description),
    };
  }),
  club: Array.from({ length: 10 }, (_, i) => {
    const description = getRandomDescription();
    return {
      recordId: 400 + i,
      studentName: getRandomStudentName(),
      description,
      byteCount: calculateByte(description),
    };
  }),
};

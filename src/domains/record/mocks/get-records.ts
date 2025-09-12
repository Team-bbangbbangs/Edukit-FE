import { http, HttpResponse } from 'msw';

import type { Records, RecordType } from '@/domains/record/types/record';

const generateMockRecords = (recordType: RecordType): Records[] => {
  const records: Records[] = [];
  const descriptions = {
    subject: [
      '수학 과목에서 뛰어난 문제해결 능력을 보여주며, 특히 기하학 영역에서 창의적인 접근 방식을 보입니다.',
      '과학 실험에 적극적으로 참여하며, 가설 설정부터 결과 분석까지 체계적으로 수행합니다.',
      '국어 수업에서 문학 작품 분석 능력이 우수하며, 토론 활동에서 논리적인 의견을 제시합니다.',
      '영어 회화 실력이 뛰어나며, 원어민과의 대화에서도 유창하게 소통합니다.',
    ],
    behavior: [
      '친구들과의 관계가 원만하며, 갈등 상황에서 중재 역할을 잘 수행합니다.',
      '학급 활동에 적극적으로 참여하며, 리더십을 발휘하여 모둠을 이끌어 갑니다.',
      '규칙을 잘 지키며, 다른 학생들에게 모범이 되는 행동을 보입니다.',
      '어려움에 처한 친구들을 도와주며, 배려심이 깊은 학생입니다.',
    ],
    career: [
      '진로에 대한 확고한 목표를 가지고 있으며, 관련 활동에 적극적으로 참여합니다.',
      '직업 체험 활동에서 성실한 태도로 임무를 수행하며, 전문가와의 인터뷰를 통해 진로 탐색에 노력합니다.',
      '자신의 적성과 흥미를 파악하기 위해 다양한 진로 검사에 참여하고 결과를 분석합니다.',
    ],
    free: [
      '독서 활동을 꾸준히 하며, 다양한 장르의 책을 읽고 감상문을 작성합니다.',
      '예술 활동에 관심이 많으며, 학교 축제에서 창작 작품을 발표합니다.',
      '봉사 활동에 적극적으로 참여하며, 지역 사회에 기여하고자 하는 의지가 강합니다.',
    ],
    club: [
      '동아리 활동에서 부장으로서 책임감 있게 활동을 이끌어 갑니다.',
      '과학 동아리에서 실험 설계부터 발표까지 전 과정에 참여하며 우수한 성과를 거둡니다.',
      '문예 동아리에서 창작 활동을 하며, 교내 문예지에 작품을 게재합니다.',
    ],
  };

  for (let i = 1; i <= 150; i++) {
    const grade = Math.floor((i - 1) / 50) + 1;
    const classNumber = Math.floor(((i - 1) % 50) / 10) + 1;
    const studentNumber = ((i - 1) % 10) + 1;

    records.push({
      recordId: i,
      grade,
      classNumber,
      studentNumber,
      studentName: `학생${i}`,
      description: descriptions[recordType][i % descriptions[recordType].length],
    });
  }

  return records;
};

const MOCK_RECORDS: Record<RecordType, Records[]> = {
  subject: generateMockRecords('subject'),
  behavior: generateMockRecords('behavior'),
  career: generateMockRecords('career'),
  free: generateMockRecords('free'),
  club: generateMockRecords('club'),
};

const getAllGrades = (): number[] => {
  const grades = new Set<number>();
  Object.values(MOCK_RECORDS).forEach((records) => {
    records.forEach((record) => grades.add(record.grade));
  });
  return Array.from(grades).sort();
};

const getAllClassNumbers = (): number[] => {
  const classNumbers = new Set<number>();
  Object.values(MOCK_RECORDS).forEach((records) => {
    records.forEach((record) => classNumbers.add(record.classNumber));
  });
  return Array.from(classNumbers).sort();
};

export const getRecords = [
  http.get('/api/v2/student-records/:recordType', ({ request, params }) => {
    const { recordType } = params;
    const url = new URL(request.url);

    const grade = url.searchParams.get('grade');
    const classNumber = url.searchParams.get('classNumber');
    const search = url.searchParams.get('search');
    const lastRecordId = url.searchParams.get('lastRecordId');
    const pageSize = 20;

    let filteredRecords = [...MOCK_RECORDS[recordType as RecordType]];

    if (grade) {
      filteredRecords = filteredRecords.filter((record) => record.grade === parseInt(grade));
    }

    if (classNumber) {
      filteredRecords = filteredRecords.filter(
        (record) => record.classNumber === parseInt(classNumber),
      );
    }

    if (search) {
      filteredRecords = filteredRecords.filter(
        (record) =>
          record.studentName.includes(search) ||
          record.description.includes(search) ||
          record.studentNumber.toString().includes(search),
      );
    }

    let startIndex = 0;
    if (lastRecordId) {
      const lastIndex = filteredRecords.findIndex(
        (record) => record.recordId === parseInt(lastRecordId),
      );
      startIndex = lastIndex + 1;
    }

    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
        data: {
          studentCount: filteredRecords.length,
          grades: getAllGrades(),
          classNumbers: getAllClassNumbers(),
          studentRecords: paginatedRecords,
        },
      },
      { status: 200 },
    );
  }),
];

import { http, HttpResponse } from 'msw';

export const postPrompt = [
  http.post('/api/v1/student-records/ai-generate/:recordId', async ({ params }) => {
    const { recordId } = params;

    if (!recordId) {
      return HttpResponse.json(
        {
          status: 404,
          code: 'EDMT-4040204',
          message: '해당 학생에 대한 생활기록부 기록이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return HttpResponse.json(
      {
        status: 200,
        code: 'EDMT-200',
        message: '요청이 성공했습니다.',
        data: {
          description1:
            '버전 1: 이 학생은 진로 탐색에 있어 매우 적극적인 자세를 보이며, 다양한 분야에 대한 관심을 바탕으로 체계적으로 자신의 미래를 설계해 나가고 있습니다.',
          description2:
            '버전 2: 창의적 체험활동을 통해 자신의 진로에 대한 명확한 비전을 세우고, 관련 분야의 전문성을 기르기 위해 지속적으로 노력하는 모습을 보여줍니다.',
          description3:
            '버전 3: 진로와 관련된 활동에 주도적으로 참여하며, 동료들과의 협력을 통해 리더십을 발휘하고 자신의 꿈을 실현하기 위한 구체적인 계획을 수립하고 있습니다.',
        },
      },
      { status: 200 },
    );
  }),
];

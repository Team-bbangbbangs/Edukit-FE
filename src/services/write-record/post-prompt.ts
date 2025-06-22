import type { Response } from '@/types/api/response';
import type { AiResponseData } from '@/types/api/student-record';

interface PostPromptParams {
  recordId: number;
  prompt: string;
  accessToken: string | null;
}

export const postPrompt = async ({
  recordId,
  prompt,
  accessToken,
}: PostPromptParams): Promise<AiResponseData> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/ai-generate/${recordId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ prompt }),
    },
  );

  const json: Response<AiResponseData> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '생기부 프롬프팅 전송 실패');
  }

  if (!json.data) {
    throw new Error('응답 데이터가 없습니다.');
  }

  return json.data;
};

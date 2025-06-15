import type { Response } from '@/types/api/response';

interface PostPromptParams {
  recordId: number;
  description: string;
}

export const postPrompt = async ({
  recordId,
  description,
}: PostPromptParams): Promise<Response<null>> => {
  const res = await fetch(`/api/v1/student-records/prompt/${recordId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '생기부 프롬프팅 전송 실패');
  }

  return json;
};

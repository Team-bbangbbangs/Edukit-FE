import { api } from '@/lib/api';
import type { AiResponseData } from '@/types/api/student-record';

interface PostPromptParams {
  recordId: number;
  prompt: string;
}

export const postPrompt = async ({ recordId, prompt }: PostPromptParams) => {
  return api.post<AiResponseData>(`/api/v1/student-records/ai-generate/${recordId}`, { prompt });
};

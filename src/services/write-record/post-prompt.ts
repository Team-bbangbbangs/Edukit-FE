import { api } from '@/lib/api';
import type { PromptResponse, PromptRequest } from '@/types/record/record';

export const postPrompt = async ({ recordId, prompt }: PromptRequest) => {
  return api.post<PromptResponse>(`/api/v1/student-records/ai-generate/${recordId}`, { prompt });
};

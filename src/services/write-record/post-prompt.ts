import type { PromptResponse, PromptRequest } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

export const postPrompt = async ({ recordId, prompt }: PromptRequest) => {
  return api.post<PromptResponse>(`/api/v1/student-records/ai-generate/${recordId}`, { prompt });
};

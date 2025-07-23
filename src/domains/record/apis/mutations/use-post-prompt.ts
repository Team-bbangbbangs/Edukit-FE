import { useMutation } from '@tanstack/react-query';

import type { PromptRequest, PromptResponse } from '@/domains/record/types/record';
import { trackEvent } from '@/shared/lib/amplitude';
import { api } from '@/shared/lib/api';

export const postPrompt = async ({ recordId, prompt }: PromptRequest) => {
  return api.post<PromptResponse>(`/api/v1/student-records/ai-generate/${recordId}`, { prompt });
};

export const usePostPrompt = () => {
  return useMutation<PromptResponse, Error, PromptRequest>({
    mutationFn: postPrompt,
    onSuccess: (data: PromptResponse, variables: PromptRequest) => {
      trackEvent('click_aiGenerate', {
        ai_inputLength: variables.prompt?.length || 0,
      });
    },
  });
};

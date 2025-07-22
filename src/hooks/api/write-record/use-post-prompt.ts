import { useMutation } from '@tanstack/react-query';

import { trackEvent } from '@/lib/amplitude/amplitude';
import { postPrompt } from '@/services/write-record/post-prompt';
import type { PromptRequest, PromptResponse } from '@/types/record/record';

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

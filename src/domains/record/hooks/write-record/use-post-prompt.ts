import { useMutation } from '@tanstack/react-query';

import type { PromptRequest, PromptResponse } from '@/domains/record/types/record';
import { postPrompt } from '@/services/write-record/post-prompt';
import { trackEvent } from '@/shared/lib/amplitude';

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

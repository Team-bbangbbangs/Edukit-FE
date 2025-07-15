import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { trackEvent } from '@/lib/amplitude/amplitude';
import { postPrompt } from '@/services/write-record/post-prompt';
import type { PostPrompt, AiResponseData } from '@/types/api/student-record';

export const usePostPrompt = () => {
  const { accessToken } = useAuth();

  return useMutation<AiResponseData, Error, PostPrompt>({
    mutationFn: postPrompt,
    onSuccess: (data: AiResponseData, variables: PostPrompt) => {
      trackEvent('click_aiGenerate', accessToken, {
        ai_inputLength: variables.prompt?.length || 0,
      });
    },
  });
};

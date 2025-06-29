import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { postPrompt } from '@/services/write-record/post-prompt';
import type { PostPrompt, AiResponseData } from '@/types/api/student-record';

export const usePostPrompt = () => {
  const { accessToken } = useAuth();

  return useMutation<AiResponseData, Error, PostPrompt>({
    mutationFn: (params) => postPrompt({ ...params, accessToken }),
  });
};

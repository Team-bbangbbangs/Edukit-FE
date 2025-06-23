import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { postPrompt } from '@/services/write-record/post-prompt';
import type { PostPrompt, AiResponseData } from '@/types/api/student-record';

export const usePostPrompt = () => {
  const { accessToken } = useAuth();

  return useMutation<AiResponseData, Error, PostPrompt>({
    mutationFn: (params) => postPrompt({ ...params, accessToken }),
    onSuccess: (data) => {
      console.log('프롬프팅 텍스트 전송 성공:', data);
    },
    onError: (error) => {
      console.error('프롬프팅 텍스트 전송 실패:', error.message);
    },
  });
};

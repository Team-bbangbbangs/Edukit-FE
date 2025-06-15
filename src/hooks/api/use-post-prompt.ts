import { useMutation } from '@tanstack/react-query';

import { postPrompt } from '@/services/write-record/post-prompt';

export const usePostPrompt = () => {
  return useMutation({
    mutationFn: postPrompt,
    onSuccess: (data) => {
      console.log('프롬프팅 텍스트 전송 성공:', data);
    },
    onError: (error) => {
      console.error('프롬프팅 텍스트 전송 실패:', error.message);
    },
  });
};

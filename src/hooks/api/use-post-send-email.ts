import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { postSendEmail } from '@/services/auth/post-send-email';
import type { Response } from '@/types/api/response';

export const usePostSendEmail = () => {
  const { accessToken } = useAuth();

  return useMutation<Response<void>, Error, void>({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('로그인 상태가 아닙니다.');
      }
      return postSendEmail(accessToken);
    },
  });
};

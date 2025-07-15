import { useMutation } from '@tanstack/react-query';

import { postSendEmail } from '@/services/auth/post-send-email';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const usePostSendEmail = () => {
  return useMutation<ApiResponseWithoutData, Error, void>({
    mutationFn: postSendEmail,
  });
};

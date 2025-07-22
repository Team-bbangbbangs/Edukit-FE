import { useMutation } from '@tanstack/react-query';

import { postSendEmail } from '@/services/profile/post-send-email';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const usePostSendEmail = () => {
  return useMutation<ApiResponseWithoutData, Error, void>({
    mutationFn: postSendEmail,
  });
};

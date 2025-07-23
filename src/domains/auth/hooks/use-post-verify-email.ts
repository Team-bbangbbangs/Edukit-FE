import { useMutation } from '@tanstack/react-query';

import { postVerifyEmail } from '@/services/auth/post-verify-email';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const usePostVerifyEmail = () => {
  return useMutation<ApiResponseWithoutData, Error, string>({
    mutationFn: postVerifyEmail,
  });
};

import { useMutation } from '@tanstack/react-query';

import { postVerifyEmail } from '@/services/auth/post-verify-email';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const usePostVerifyEmail = () => {
  return useMutation<ApiResponseWithoutData, Error, string>({
    mutationFn: postVerifyEmail,
  });
};

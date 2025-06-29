import { useMutation } from '@tanstack/react-query';

import { postVerifyEmail } from '@/services/auth/post-verify-email';
import type { Response } from '@/types/api/response';

export const usePostVerifyEmail = () => {
  return useMutation<Response<null>, Error, string>({
    mutationFn: postVerifyEmail,
  });
};

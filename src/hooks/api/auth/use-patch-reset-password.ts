import { useMutation } from '@tanstack/react-query';

import { patchResetPassword } from '@/services/auth/patch-reset-password';
import type { LoginBody } from '@/types/auth/auth';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const usePatchResetPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, LoginBody>({
    mutationFn: patchResetPassword,
  });
};

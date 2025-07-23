import { useMutation } from '@tanstack/react-query';

import type { LoginBody } from '@/domains/auth/types/auth';
import { patchResetPassword } from '@/services/auth/patch-reset-password';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const usePatchResetPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, LoginBody>({
    mutationFn: patchResetPassword,
  });
};

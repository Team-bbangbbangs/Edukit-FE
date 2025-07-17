import { useMutation } from '@tanstack/react-query';

import { patchResetPassword } from '@/services/auth/patch-reset-password';
import type { LoginProp } from '@/types/api/auth';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const usePatchResetPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, LoginProp>({
    mutationFn: patchResetPassword,
  });
};

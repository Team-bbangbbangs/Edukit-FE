import { useMutation } from '@tanstack/react-query';

import { patchAfterLoginPassword } from '@/services/profile/patch-after-login-password';
import type { PatchAfterLoginPassword } from '@/types/api/auth';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const usePatchAfterLoginPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, PatchAfterLoginPassword>({
    mutationFn: patchAfterLoginPassword,
    onError: (error) => {
      alert(error.message);
    },
  });
};

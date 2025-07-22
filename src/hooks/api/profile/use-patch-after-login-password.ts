import { useMutation } from '@tanstack/react-query';

import { patchAfterLoginPassword } from '@/services/profile/patch-after-login-password';
import type { EditPasswordBody } from '@/types/profile/profile';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const usePatchAfterLoginPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, EditPasswordBody>({
    mutationFn: patchAfterLoginPassword,
    onError: (error) => {
      alert(error.message);
    },
  });
};

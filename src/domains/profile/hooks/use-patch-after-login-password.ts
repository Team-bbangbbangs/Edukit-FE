import { useMutation } from '@tanstack/react-query';

import type { EditPasswordBody } from '@/domains/profile/types/profile';
import { patchAfterLoginPassword } from '@/services/profile/patch-after-login-password';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const usePatchAfterLoginPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, EditPasswordBody>({
    mutationFn: patchAfterLoginPassword,
    onError: (error) => {
      alert(error.message);
    },
  });
};

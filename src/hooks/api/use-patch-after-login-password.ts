import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { patchAfterLoginPassword } from '@/services/auth/patch-after-login-password';
import type { PatchAfterLoginPasswordProps } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const usePatchAfterLoginPassword = () => {
  const { accessToken } = useAuth();

  return useMutation<Response<null>, Error, PatchAfterLoginPasswordProps>({
    mutationFn: (params) => patchAfterLoginPassword({ ...params, accessToken }),
    onError: (error) => {
      alert(error.message);
    },
  });
};

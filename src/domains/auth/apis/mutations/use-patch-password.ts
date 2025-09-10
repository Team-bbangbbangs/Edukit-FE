import { useMutation } from '@tanstack/react-query';

import type { PatchPasswordBody } from '@/domains/auth/types/auth';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const patchPassword = async ({
  memberUuid,
  verificationCode,
  password,
}: PatchPasswordBody) => {
  return api.patch<ApiResponseWithoutData>(
    '/api/v2/auth/password',
    {
      memberUuid,
      verificationCode,
      password,
    },
    { skipTokenRefresh: true },
  );
};

export const usePatchPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, PatchPasswordBody>({
    mutationFn: patchPassword,
  });
};

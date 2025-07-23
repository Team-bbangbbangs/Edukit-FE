import { useMutation } from '@tanstack/react-query';

import type { EditPasswordBody } from '@/domains/profile/types/profile';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const patchAfterLoginPassword = async ({
  currentPassword,
  newPassword,
}: EditPasswordBody) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/password', {
    currentPassword,
    newPassword,
  });
};

export const usePatchAfterLoginPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, EditPasswordBody>({
    mutationFn: patchAfterLoginPassword,
    onError: (error) => {
      alert(error.message);
    },
  });
};

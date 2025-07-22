import { api } from '@/lib/api';
import type { EditPasswordBody } from '@/types/profile/profile';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const patchAfterLoginPassword = async ({
  currentPassword,
  newPassword,
}: EditPasswordBody) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/password', {
    currentPassword,
    newPassword,
  });
};

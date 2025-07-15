import { api } from '@/lib/api';
import type { PatchAfterLoginPassword } from '@/types/api/auth';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const patchAfterLoginPassword = async ({
  currentPassword,
  newPassword,
}: PatchAfterLoginPassword) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/password', {
    currentPassword,
    newPassword,
  });
};

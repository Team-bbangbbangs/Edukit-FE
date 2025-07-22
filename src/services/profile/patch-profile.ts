import { api } from '@/lib/api';
import type { EditProfileBody } from '@/types/profile/profile';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const patchProfile = async ({ subject, school, nickname }: EditProfileBody) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/profile', {
    subject,
    school,
    nickname,
  });
};

import type { EditProfileBody } from '@/domains/profile/types/profile';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const patchProfile = async ({ subject, school, nickname }: EditProfileBody) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/profile', {
    subject,
    school,
    nickname,
  });
};

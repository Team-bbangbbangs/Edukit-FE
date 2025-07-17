import { api } from '@/lib/api';
import type { PatchProfile } from '@/types/api/auth';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const patchProfile = async ({ subject, school, nickname }: PatchProfile) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/profile', {
    subject,
    school,
    nickname,
  });
};

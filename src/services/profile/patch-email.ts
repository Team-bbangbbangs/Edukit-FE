import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const patchEmail = async (email: string) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/email', { email });
};

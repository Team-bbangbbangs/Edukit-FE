import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const patchEmail = async (email: string) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/email', { email });
};

import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const postSendEmail = async () => {
  return api.post<ApiResponseWithoutData>('/api/v1/auth/email/send-verification');
};

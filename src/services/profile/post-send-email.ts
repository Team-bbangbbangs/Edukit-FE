import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const postSendEmail = async () => {
  return api.post<ApiResponseWithoutData>('/api/v1/auth/email/send-verification');
};

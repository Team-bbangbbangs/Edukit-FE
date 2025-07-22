import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const postSendEmail = async () => {
  return api.post<ApiResponseWithoutData>('/api/v1/auth/email/send-verification');
};

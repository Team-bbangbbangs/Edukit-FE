import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const postSendEmail = async () => {
  return api.post<ApiResponseWithoutData>('/api/v1/auth/email/send-verification');
};

export const usePostSendEmail = () => {
  return useMutation<ApiResponseWithoutData, Error, void>({
    mutationFn: postSendEmail,
  });
};

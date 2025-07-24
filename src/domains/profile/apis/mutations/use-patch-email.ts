import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const patchEmail = async (email: string) => {
  return api.patch<ApiResponseWithoutData>('/api/v1/users/email', { email });
};

export const usePatchEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, string>({
    mutationFn: patchEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};

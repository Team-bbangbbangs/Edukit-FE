import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchEmail } from '@/services/profile/patch-email';
import type { ApiResponseWithoutData } from '@/shared/types/response';

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

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchProfile } from '@/services/profile/patch-profile';
import type { PatchProfile } from '@/types/api/auth';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const usePatchProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, PatchProfile>({
    mutationFn: patchProfile,
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

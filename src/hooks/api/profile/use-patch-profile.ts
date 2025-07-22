import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchProfile } from '@/services/profile/patch-profile';
import type { EditProfileBody } from '@/types/profile/profile';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const usePatchProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, EditProfileBody>({
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

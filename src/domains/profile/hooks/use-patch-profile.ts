import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { EditProfileBody } from '@/domains/profile/types/profile';
import { patchProfile } from '@/services/profile/patch-profile';
import type { ApiResponseWithoutData } from '@/shared/types/response';

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

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { patchProfile } from '@/services/auth/patch-profile';
import type { PatchProfileProps } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const usePatchProfile = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Response<null>, Error, PatchProfileProps>({
    mutationFn: (params) => patchProfile({ ...params, accessToken }),
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

import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { getCheckValidNickname } from '@/services/auth/get-check-valid-nickname';
import type { GetCheckValidNicknameResponse } from '@/types/api/auth';

export const useGetCheckValidNickname = () => {
  const { accessToken } = useAuth();

  return useMutation<GetCheckValidNicknameResponse, Error, string>({
    mutationFn: (nickname) => getCheckValidNickname({ nickname, accessToken }),
    onError: (error) => {
      alert(error.message);
    },
  });
};

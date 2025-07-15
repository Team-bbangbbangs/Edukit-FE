import { useMutation } from '@tanstack/react-query';

import { getCheckValidNickname } from '@/services/profile/get-check-valid-nickname';
import type { GetCheckValidNicknameResponse } from '@/types/api/auth';

export const useGetCheckValidNickname = () => {
  return useMutation<GetCheckValidNicknameResponse, Error, string>({
    mutationFn: getCheckValidNickname,
    onError: (error) => {
      alert(error.message);
    },
  });
};

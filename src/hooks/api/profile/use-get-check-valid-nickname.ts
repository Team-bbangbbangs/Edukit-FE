import { useMutation } from '@tanstack/react-query';

import { getCheckValidNickname } from '@/services/profile/get-check-valid-nickname';
import type { GetCheckValidNicknameResponse } from '@/types/profile/profile';

export const useGetCheckValidNickname = () => {
  return useMutation<GetCheckValidNicknameResponse, Error, string>({
    mutationFn: getCheckValidNickname,
    onError: (error) => {
      alert(error.message);
    },
  });
};

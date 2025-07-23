import { useMutation } from '@tanstack/react-query';

import type { GetCheckValidNicknameResponse } from '@/domains/profile/types/profile';
import { getCheckValidNickname } from '@/services/profile/get-check-valid-nickname';

export const useGetCheckValidNickname = () => {
  return useMutation<GetCheckValidNicknameResponse, Error, string>({
    mutationFn: getCheckValidNickname,
    onError: (error) => {
      alert(error.message);
    },
  });
};

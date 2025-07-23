import type { GetCheckValidNicknameResponse } from '@/domains/profile/types/profile';
import { api } from '@/shared/lib/api';

export const getCheckValidNickname = async (nickname: string) => {
  return api.get<GetCheckValidNicknameResponse>('/api/v1/users/nickname', {
    params: { nickname },
  });
};

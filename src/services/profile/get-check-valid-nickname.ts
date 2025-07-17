import { api } from '@/lib/api';
import type { GetCheckValidNicknameResponse } from '@/types/api/auth';

export const getCheckValidNickname = async (nickname: string) => {
  return api.get<GetCheckValidNicknameResponse>('/api/v1/users/nickname', {
    params: { nickname },
  });
};

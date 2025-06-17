import type { UserInfoTypes } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const getProfile = async (): Promise<UserInfoTypes> => {
  const res = await fetch('/api/v1/users/profile');

  const json: Response<UserInfoTypes> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '유저 정보 불러오기 실패');
  }
  if (!json.data) {
    throw new Error('응답에 데이터가 없습니다.');
  }

  return json.data;
};

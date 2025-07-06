import type { GetCheckValidNicknameRequest, GetCheckValidNicknameResponse } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const getCheckValidNickname = async ({
  nickname,
  accessToken,
}: GetCheckValidNicknameRequest) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/nickname?nickname=${nickname}`,
    {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    },
  );

  const json: Response<GetCheckValidNicknameResponse> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '닉네임 변경 실패');
  }
  if (!json.data) {
    throw new Error('응답에 데이터가 없습니다.');
  }

  return json.data;
};

export type SchoolType = 'middle' | 'high';

export type AuthResponse = {
  accessToken: string;
  isAdmin: boolean;
};

export type LoginProp = {
  email: string;
  password: string;
};

export type SignupTypes = {
  email: string;
  password: string;
  subject: string;
  school: string;
};

export type UserInfoTypes = {
  subject: string;
  email: string;
  isTeacherVerified: boolean;
  school: string;
  nickname: string;
};

export type PatchProfileProps = {
  subject: string;
  school: string;
  nickname: string;
};

export type PatchProfile = {
  subject: string;
  school: string;
  nickname: string;
  accessToken: string | null;
};

export type GetCheckValidNicknameResponse = {
  isInvalid: boolean;
  isDuplicated: boolean;
};

export type GetCheckValidNicknameRequest = {
  nickname: string;
  accessToken: string | null;
};

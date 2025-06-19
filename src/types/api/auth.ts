export type SchoolType = 'middle' | 'high';

export type AuthResponse = {
  accessToken: string;
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

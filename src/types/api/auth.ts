export type SchoolType = 'middle' | 'high';

export type AccessTokenType = {
  id: string;
  role: string;
};

export type LoginResponse = {
  accessToken: AccessTokenType;
  nickName: string;
  school: SchoolType;
  profileImage: string;
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

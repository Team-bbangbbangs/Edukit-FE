export type SchoolType = '“middleSchool' | 'highSchool';

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

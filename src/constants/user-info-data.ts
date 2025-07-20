import type { UserInfoTypes } from '@/types/api/auth';

export const NOT_VERIFUED_USER_INFO_DATA: UserInfoTypes = {
  subject: '수학',
  email: 'youngryu10@gmail.com',
  isTeacherVerified: false,
  school: 'middle',
  nickname: '이승섭',
};

export const USER_INFO_DATA: UserInfoTypes = {
  subject: '수학',
  email: 'youngryu10@gmail.com',
  isTeacherVerified: true,
  school: 'middle',
  nickname: '이승섭',
};

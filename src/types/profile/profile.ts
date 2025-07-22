export interface ProfileResponse {
  subject: string;
  email: string;
  isTeacherVerified: boolean;
  school: string;
  nickname: string;
}

export interface EditProfileBody {
  subject: string;
  school: string;
  nickname: string;
}

export interface GetCheckValidNicknameResponse {
  isInvalid: boolean;
  isDuplicated: boolean;
}

export interface EditPasswordBody {
  currentPassword: string;
  newPassword: string;
}

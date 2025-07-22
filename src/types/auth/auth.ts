export interface AuthResponse {
  accessToken: string;
  isAdmin: boolean;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface SignupBody {
  email: string;
  password: string;
  subject: string;
  school: string;
}

export interface VerifyEmailRequest {
  id: string;
  code: string;
}

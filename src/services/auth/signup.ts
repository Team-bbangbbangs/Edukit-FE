import type { AuthResponse, SignupTypes } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const signup = async ({
  email,
  password,
  subject,
  school,
}: SignupTypes): Promise<AuthResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, subject, school }),
  });

  const json: Response<AuthResponse> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '회원가입 실패');
  }

  if (!json.data) {
    throw new Error(json.message || '회원가입 실패');
  }

  return json.data;
};

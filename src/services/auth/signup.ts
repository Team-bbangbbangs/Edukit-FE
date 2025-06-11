import type { SignupTypes } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const signup = async ({
  email,
  password,
  subject,
  school,
}: SignupTypes): Promise<Response<null>> => {
  const res = await fetch('/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, subject, school }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '회원가입 실패');
  }

  return json;
};

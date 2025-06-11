export const getVerifyEmail = async (email: string, token: string) => {
  console.log(email, token);
  const res = await fetch(
    `/api/v1/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '이메일 인증에 실패했습니다.');
  }

  return res.json();
};

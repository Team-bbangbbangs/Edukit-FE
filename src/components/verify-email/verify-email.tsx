'use client';

import { useEffect, useState } from 'react';

import { useGetVerifyEmail } from '@/hooks/api/use-get-verify-email';

interface VerifyEmailProps {
  email?: string;
  token?: string;
}

export default function VerifyEmail({ email, token }: VerifyEmailProps) {
  const { mutate: getVerifyEmail } = useGetVerifyEmail();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (email && token) {
      setMessage('이메일 인증 중...');
      getVerifyEmail({ email, token });
    } else if (email) {
      setMessage(`${email} 주소로 인증 메일을 보냈습니다.`);
    } else {
      setMessage('잘못된 접근입니다.');
    }
  }, [email, token, getVerifyEmail]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}

'use client';

import { useState } from 'react';

import Link from 'next/link';

import EmailSent from './email-sent';
import EmailVerificationForm from './email-verification-form';

export default function FindPassword() {
  const [step, setStep] = useState<'email' | 'email-sent'>('email');

  const handleEmailSent = () => {
    setStep('email-sent');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-slate-700 px-10 py-16">
      <h2 className="mb-4 text-heading-28">비밀번호 찾기</h2>
      {step === 'email' ? <EmailVerificationForm onEmailSent={handleEmailSent} /> : <EmailSent />}

      <div className="mt-4">
        <Link href="/login" className="text-slate-600 hover:text-slate-800 hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

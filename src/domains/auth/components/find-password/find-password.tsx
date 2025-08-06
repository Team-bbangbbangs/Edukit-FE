'use client';

import { useState } from 'react';

import Link from 'next/link';

import { EmailVerificationForm } from './email-verification-form';
import { PasswordResetForm } from './password-reset-form';

export default function FindPassword() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const handleEmailSuccess = (email: string) => {
    setVerifiedEmail(email);
    setStep('password');
  };

  const handleBackToEmail = () => {
    setStep('email');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-slate-700 px-10 py-16">
      <h2 className="mb-4 text-[30px] font-bold">비밀번호 찾기</h2>

      {step === 'email' ? (
        <EmailVerificationForm onSuccess={handleEmailSuccess} />
      ) : (
        <PasswordResetForm verifiedEmail={verifiedEmail} onBack={handleBackToEmail} />
      )}

      <div className="mt-4">
        <Link href="/login" className="hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

interface VerifyEmailHandlerProps {
  isSuccess: boolean;
}

export default function VerifyEmailHandler({ isSuccess }: VerifyEmailHandlerProps) {
  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('emailVerified', 'true');
      localStorage.setItem('emailVerifiedAt', Date.now().toString());

      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, [isSuccess]);

  return null;
}

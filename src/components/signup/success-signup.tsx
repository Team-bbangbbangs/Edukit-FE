import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import EmailSentModal from '@/components/modal/email-sent-modal';
import { usePostSendEmail } from '@/hooks/api/auth/use-post-send-email';

export default function SuccessSignup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: postSendEmail } = usePostSendEmail();

  const handleClick = () => {
    postSendEmail(undefined, {
      onSuccess: () => {
        setOpen(true);
      },
      onError: (error) => {
        alert(error.message);
      },
    });
  };

  useEffect(() => {
    const checkEmailVerification = () => {
      const isVerified = localStorage.getItem('emailVerified');
      const verifiedAt = localStorage.getItem('emailVerifiedAt');

      if (isVerified === 'true' && verifiedAt) {
        const verifiedTime = parseInt(verifiedAt);
        const now = Date.now();

        if (now - verifiedTime < 5 * 60 * 1000) {
          setIsLoading(true);

          localStorage.removeItem('emailVerified');
          localStorage.removeItem('emailVerifiedAt');

          setTimeout(() => {
            router.push('/');
          }, 1000);
        }
      }
    };

    const interval = setInterval(checkEmailVerification, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-800" />
        <p className="text-xl text-gray-700">인증이 완료되었습니다. 잠시만 기다려주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 py-8 text-center">
      <h2 className="text-4xl font-bold">가입 완료</h2>
      <p className="text-2xl text-gray-700">
        가입하신 이메일로 인증 메일을 보냈습니다.
        <br />
        메일함을 확인해주세요.
      </p>
      <p className="cursor-pointer hover:underline" onClick={handleClick}>
        이메일을 못받으셨나요?
      </p>
      <EmailSentModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

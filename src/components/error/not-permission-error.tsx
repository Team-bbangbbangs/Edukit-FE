'use client';

import { useState } from 'react';

import EmailSentModal from '@/components/modal/email-sent-modal';
import { usePostSendEmail } from '@/hooks/api/use-post-send-email';

export default function NotPermissionError() {
  const [open, setOpen] = useState(false);

  const { mutate: postSendEmail, isPending } = usePostSendEmail();

  const handleSendEmail = () => {
    postSendEmail(undefined, {
      onSuccess: () => {
        setOpen(true);
      },
      onError: (error) => {
        alert(error.message);
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="text-[20px] font-bold">이메일 인증 후 서비스 이용이 가능합니다.</p>
      <button
        onClick={handleSendEmail}
        disabled={isPending}
        className="rounded-lg bg-slate-800 px-10 py-4 text-[20px] font-bold text-white hover:bg-slate-950"
      >
        이메일 인증하기
      </button>
      <EmailSentModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

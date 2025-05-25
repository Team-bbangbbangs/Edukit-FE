'use client';

import { useState } from 'react';

import LoginModal from '@/components/modal/login-modal';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex justify-between gap-4 border-b border-solid border-black px-10 py-3">
      <span className="text-2xl font-bold">EduMate</span>
      <button className="rounded-full bg-black px-4 py-2 text-white" onClick={() => setOpen(true)}>
        로그인
      </button>

      <LoginModal open={open} onOpenChange={setOpen} />
    </header>
  );
}

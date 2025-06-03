'use client';

import { useState } from 'react';

import Link from 'next/link';

import LoginModal from '@/components/modal/login-modal';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-#e5e7eb fixed top-0 z-50 flex h-16 w-full justify-between border-b bg-white px-10 py-3">
      <Link href="/" className="pt-1 text-2xl font-bold text-black">
        EduMate
      </Link>
      <button className="rounded-full bg-black px-4 py-2 text-white" onClick={() => setOpen(true)}>
        로그인
      </button>

      <LoginModal open={open} onOpenChange={setOpen} />
    </header>
  );
}

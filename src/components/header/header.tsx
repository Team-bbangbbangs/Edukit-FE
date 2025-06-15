'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 z-50 flex h-16 w-full justify-between border-b bg-white px-10 py-3">
      <Link href="/" className="pt-1 text-2xl font-bold text-black">
        EduMate
      </Link>
      <Link href="/login" className="rounded-full bg-black px-4 py-2 text-white">
        로그인
      </Link>
    </header>
  );
}

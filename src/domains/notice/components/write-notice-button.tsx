'use client';

import Link from 'next/link';

import { useAuth } from '@/shared/providers/auth-provider';

export default function WriteNoticeButton() {
  const { isAdmin } = useAuth();

  return isAdmin ? (
    <div className="flex justify-end">
      <Link
        href="/notice/write-notice"
        className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-950"
      >
        글쓰기
      </Link>
    </div>
  ) : null;
}

'use client';

import Link from 'next/link';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="h-screen w-full p-10">
      <Link
        href={'/notice'}
        className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white hover:bg-slate-950"
      >
        돌아가기
      </Link>
      <p className="text-center text-[30px] font-bold">{error.message}</p>
    </div>
  );
}

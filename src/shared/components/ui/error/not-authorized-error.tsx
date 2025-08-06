import Link from 'next/link';

export default function NotAuthorizedError() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="text-[20px] font-bold">로그인이 필요합니다.</p>
      <Link
        href="/login"
        className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-950"
      >
        로그인
      </Link>
    </div>
  );
}

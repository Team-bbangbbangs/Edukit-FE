import { BadgeAlert } from 'lucide-react';

import Link from 'next/link';

export default function ErrorNotice() {
  return (
    <div className="mt-40 flex flex-col items-center justify-center gap-4">
      <BadgeAlert width={40} height={40} />
      <p className="text-[24px] font-bold">등록된 공지사항이 없습니다.</p>
      <Link
        href={'/notice'}
        className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white hover:bg-slate-950"
      >
        돌아가기
      </Link>
    </div>
  );
}

import Link from 'next/link';

import { type NoticeCategoryType } from '../types/notice';

const baseStyle = 'rounded-full px-5 py-1 pt-1.5 text-center font-bold text-[14px]';

const activeStyle = 'bg-slate-800 text-white border border-white';

const nonActiveStyle = 'bg-white text-black border border-slate-400';

export default function NoticeCategorys({ category }: { category?: NoticeCategoryType }) {
  return (
    <div className="flex gap-2 py-4">
      <Link href="/notice" className={`${baseStyle} ${!category ? activeStyle : nonActiveStyle}`}>
        전체
      </Link>
      <Link
        href="/notice?category=announcement"
        className={`${baseStyle} ${category === 'announcement' ? activeStyle : nonActiveStyle}`}
      >
        공지
      </Link>
      <Link
        href="/notice?category=event"
        className={`${baseStyle} ${category === 'event' ? activeStyle : nonActiveStyle}`}
      >
        이벤트
      </Link>
    </div>
  );
}

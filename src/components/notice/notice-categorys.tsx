import Link from 'next/link';

const baseStyle = 'rounded-full px-5 py-1 pt-1.5 text-center font-bold text-[14px]';

const activeStyle = 'bg-slate-800 text-white border border-white';

const nonActiveStyle = 'bg-white text-black border border-slate-400';

export default function NoticeCategorys({ categoryId }: { categoryId?: string }) {
  return (
    <div className="flex gap-2 py-4">
      <Link href="/notice" className={`${baseStyle} ${!categoryId ? activeStyle : nonActiveStyle}`}>
        전체
      </Link>
      <Link
        href="/notice?categoryId=2"
        className={`${baseStyle} ${categoryId === '2' ? activeStyle : nonActiveStyle}`}
      >
        공지
      </Link>
      <Link
        href="/notice?categoryId=3"
        className={`${baseStyle} ${categoryId === '3' ? activeStyle : nonActiveStyle}`}
      >
        이벤트
      </Link>
    </div>
  );
}

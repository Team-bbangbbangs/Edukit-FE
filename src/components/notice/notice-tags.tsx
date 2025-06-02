import Link from 'next/link';

const baseStyle = 'rounded-full px-5 py-1 pt-1.5 text-center font-bold ';

const activeStyle = 'bg-slate-800 text-white border border-white';

const nonActiveStyle = 'bg-white text-black border border-slate-400';

export default function NoticeTags({ tagId }: { tagId?: string }) {
  return (
    <div className="flex gap-4 py-6">
      <Link href="/notice" className={`${baseStyle} ${!tagId ? activeStyle : nonActiveStyle}`}>
        전체
      </Link>
      <Link
        href="/notice?tagId=2"
        className={`${baseStyle} ${tagId === '2' ? activeStyle : nonActiveStyle}`}
      >
        공지
      </Link>
      <Link
        href="/notice?tagId=3"
        className={`${baseStyle} ${tagId === '3' ? activeStyle : nonActiveStyle}`}
      >
        이벤트
      </Link>
    </div>
  );
}

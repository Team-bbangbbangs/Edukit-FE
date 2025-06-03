import Link from 'next/link';

import type { NoticeType } from '@/types/api/notice';
import { formatDate } from '@/util/formatDate';

export default function NoticeList({ notice }: { notice: NoticeType[] }) {
  return (
    <div className="mb-4 w-full border-b border-t border-b-slate-400 border-t-slate-400">
      {notice.map((item) => (
        <Link
          key={item.id}
          href={`/notice/${item.id}`}
          className="flex h-14 items-center align-middle text-black hover:bg-slate-200"
        >
          <span className="w-40 px-10 font-bold">{item.tag}</span>
          <span>{item.title}</span>
          <time className="ml-auto w-60 px-5">{formatDate(item.createdAt)}</time>
        </Link>
      ))}
    </div>
  );
}

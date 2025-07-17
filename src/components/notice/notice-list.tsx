import Link from 'next/link';

import type { NoticeType } from '@/types/api/notice';
import { formatDate } from '@/util/formatDate';

export default function NoticeList({ notice }: { notice: NoticeType[] }) {
  return (
    <div className="mb-4 w-full border-b border-t border-b-slate-400 border-t-slate-400">
      {notice.map((item) => (
        <Link
          key={item.noticeId}
          href={`/notice/${item.noticeId}`}
          className="flex h-14 items-center px-5 align-middle text-black hover:bg-slate-200"
        >
          <span className="min-w-12 font-bold">{item.category}</span>
          <span className="px-4 md:px-10">{item.title}</span>
          <time className="ml-auto hidden min-w-32 md:block">{formatDate(item.createdAt)}</time>
        </Link>
      ))}
    </div>
  );
}

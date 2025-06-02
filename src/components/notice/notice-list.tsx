import Link from 'next/link';

import type { NoticeType } from '@/types/api/notice';
import { formatDate } from '@/util/formatDate';

export default function NoticeList({ notice }: { notice: NoticeType[] }) {
  return (
    <ul className="w-full border-t border-t-slate-600">
      {notice.map((item) => (
        <li key={item.id} className="h-20 border-b border-b-slate-400">
          <Link
            href={`/notice/${item.id}`}
            className="flex align-middle text-black hover:bg-slate-400"
          >
            <span className="w-24 px-4 font-bold">{item.tag}</span>
            <span>{item.title}</span>
            <time className="w-40 px-5">{formatDate(item.createdAt)}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

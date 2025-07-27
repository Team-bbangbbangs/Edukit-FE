import Link from 'next/link';

import { getNoticeDetail } from '@/domains/notice/apis/get-notice-detail';
import EditDeleteNoticeButton from '@/domains/notice/components/edit-delete-notice-button';
import { formatDate } from '@/shared/utils/formatDate';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  const data = await getNoticeDetail(id);

  return (
    <div className="w-full">
      <h2 className="mb-10 text-[26px] font-bold">{data.category}</h2>
      <h3 className="text-[20px] font-bold">{data.title}</h3>
      <span className="text-[14px] text-slate-600">{formatDate(data.createdAt)}</span>
      <hr />
      <div className="prose mb-16 mt-10" dangerouslySetInnerHTML={{ __html: data.content }} />
      <div className="flex justify-between">
        <Link
          href={'/notice'}
          className="rounded-md border border-slate-600 px-5 py-2 hover:bg-slate-400"
        >
          돌아가기
        </Link>
        <EditDeleteNoticeButton id={id} />
      </div>
    </div>
  );
}

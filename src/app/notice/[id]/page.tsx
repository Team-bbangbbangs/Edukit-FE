import Link from 'next/link';

import { getNoticeDetail } from '@/services/notice/get-notice-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  const noticeData = await getNoticeDetail(id);

  return (
    <div className="w-full px-10">
      <h2 className="mb-10 text-[26px] font-bold">{noticeData.data?.tag}</h2>
      <h3 className="text-[20px] font-bold">{noticeData.data?.title}</h3>
      <span className="text-[14px] text-slate-600">{noticeData.data?.createdAt}</span>
      <hr />
      <p className="mb-16 mt-10">{noticeData.data?.content}</p>
      <Link
        href={'/notice'}
        className="rounded-md border border-slate-600 px-5 py-2 hover:bg-slate-400"
      >
        돌아가기
      </Link>
    </div>
  );
}

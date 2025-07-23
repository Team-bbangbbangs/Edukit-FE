import { redirect } from 'next/navigation';

import ErrorNotice from '@/domains/notice/components/error-notice';
import NoticeCategorys from '@/domains/notice/components/notice-categorys';
import NoticeList from '@/domains/notice/components/notice-list';
import WriteNoticeButton from '@/domains/notice/components/write-notice-button';
import type { NoticeListRequest } from '@/domains/notice/types/notice';
import { getNoticeList } from '@/services/notice/get-notice-list';
import Pagination from '@/shared/components/ui/pagination/pagination';

interface PageProps {
  searchParams?: NoticeListRequest;
}

export default async function NoticePage({ searchParams }: PageProps) {
  const page = searchParams?.page;
  const categoryId = searchParams?.categoryId;

  if (categoryId && !['2', '3'].includes(categoryId)) {
    redirect('/notice');
  }

  const data = await getNoticeList({
    page,
    categoryId,
  });
  const parsedPage = isNaN(Number(page)) ? 1 : Number(page);

  return (
    <div className="h-full w-full">
      <h2 className="text-[26px] font-bold">공지사항</h2>

      <NoticeCategorys categoryId={categoryId} />

      {data.notices.length > 0 ? <NoticeList notice={data.notices} /> : <ErrorNotice />}

      {parsedPage >= 1 && parsedPage <= data.totalPages ? (
        <Pagination
          categoryId={categoryId}
          nowPage={parsedPage.toString()}
          totalPages={data.totalPages}
        />
      ) : null}

      <WriteNoticeButton />
    </div>
  );
}

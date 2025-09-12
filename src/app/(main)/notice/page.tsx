import { redirect } from 'next/navigation';

import { getNoticeList } from '@/domains/notice/apis/get-notice-list';
import ErrorNotice from '@/domains/notice/components/error-notice';
import NoticeCategorys from '@/domains/notice/components/notice-categorys';
import NoticeList from '@/domains/notice/components/notice-list';
import WriteNoticeButton from '@/domains/notice/components/write-notice-button';
import type { NoticeListRequest } from '@/domains/notice/types/notice';
import Pagination from '@/shared/components/ui/pagination/pagination';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('notice');

interface PageProps {
  searchParams?: NoticeListRequest;
}

export default async function NoticePage({ searchParams }: PageProps) {
  const page = searchParams?.page;
  const category = searchParams?.category;

  if (category && !['announcement', 'event'].includes(category)) {
    redirect('/notice');
  }

  const data = await getNoticeList({
    page,
    category,
  });
  const parsedPage = isNaN(Number(page)) ? 1 : Number(page);

  return (
    <div className="h-full w-full">
      <h2 className="text-[26px] font-bold">공지사항</h2>

      <NoticeCategorys category={category} />

      {data.notices.length > 0 ? <NoticeList notice={data.notices} /> : <ErrorNotice />}

      {parsedPage >= 1 && parsedPage <= data.totalPages ? (
        <Pagination
          category={category}
          nowPage={parsedPage.toString()}
          totalPages={data.totalPages}
        />
      ) : null}

      <WriteNoticeButton />
    </div>
  );
}

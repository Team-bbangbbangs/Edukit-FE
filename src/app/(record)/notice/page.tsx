import EmptyNotice from '@/components/notice/empty-notice';
import NoticeCategorys from '@/components/notice/notice-categorys';
import NoticeList from '@/components/notice/notice-list';
import WriteNoticeButton from '@/components/notice/write-notice-button';
import Pagination from '@/components/pagination/pagination';
import { getNoticeList } from '@/services/notice/get-notice-list';

interface PageProps {
  searchParams?: {
    page?: string;
    categoryId?: string;
  };
}

export default async function NoticePage({ searchParams }: PageProps) {
  const page = searchParams?.page;
  const categoryId = searchParams?.categoryId;

  const data = await getNoticeList({
    page,
    categoryId,
  });

  return (
    <div className="h-full w-full">
      <h2 className="text-[26px] font-bold">공지사항</h2>

      <NoticeCategorys categoryId={categoryId} />

      {data.notices.length > 0 ? <NoticeList notice={data.notices} /> : <EmptyNotice />}

      {data.totalPages ? (
        <Pagination categoryId={categoryId} nowPage={page} totalPages={data.totalPages} />
      ) : null}

      <WriteNoticeButton />
    </div>
  );
}

import NoticeCategorys from '@/components/notice/notice-categorys';
import NoticeList from '@/components/notice/notice-list';
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
    <div className="w-full px-10">
      <h2 className="text-[26px] font-bold">공지사항</h2>

      <NoticeCategorys categoryId={categoryId} />

      {data?.notices ? <NoticeList notice={data.notices} /> : null}

      {data?.totalPages ? (
        <Pagination categoryId={categoryId} nowPage={page} maxPage={data.totalPages} />
      ) : null}
    </div>
  );
}

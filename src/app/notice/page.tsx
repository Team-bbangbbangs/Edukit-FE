import NoticeList from '@/components/notice/notice-list';
import NoticeTags from '@/components/notice/notice-tags';
import Pagination from '@/components/pagination/pagination';
import { getNoticeList } from '@/services/notice/get-notice-list';

interface PageProps {
  searchParams?: {
    page?: string;
    tagId?: string;
  };
}

export default async function NoticePage({ searchParams }: PageProps) {
  const page = searchParams?.page;
  const tagId = searchParams?.tagId;

  // const notices = await getNoticeList({
  //   page,
  //   tagId,
  // });

  return (
    <div className="w-full p-10">
      <h2 className="text-[30px] font-bold">공지사항</h2>

      <NoticeTags tagId={tagId} />

      {/* {notices?.NoticeList ? <NoticeList notice={notices.NoticeList} /> : null} */}

      {/* {notices ? <Pagination nowPage={page} maxPage={12} /> : null} */}
      <Pagination tagId={tagId} nowPage={page} maxPage={12} />
    </div>
  );
}

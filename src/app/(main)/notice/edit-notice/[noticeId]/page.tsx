import { getNoticeDetail } from '@/domains/notice/apis/get-notice-detail';
import EditNotice from '@/domains/notice/components/edit-notice';

interface PageProps {
  params: {
    noticeId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const notice = await getNoticeDetail(Number(params.noticeId));
  return <EditNotice notice={notice} />;
}

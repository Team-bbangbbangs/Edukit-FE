import { getNoticeDetail } from '@/domains/notice/apis/get-notice-detail';
import EditNotice from '@/domains/notice/components/edit-notice';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const notice = await getNoticeDetail(params.id);
  return <EditNotice notice={notice} />;
}

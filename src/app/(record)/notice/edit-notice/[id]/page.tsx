import EditNotice from '@/domains/notice/components/edit-notice';
import { getNoticeDetail } from '@/services/notice/get-notice-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const notice = await getNoticeDetail(params.id);
  return <EditNotice notice={notice} />;
}

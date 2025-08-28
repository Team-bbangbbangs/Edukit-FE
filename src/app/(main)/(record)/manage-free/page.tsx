import FreeRecordTable from '@/domains/record/components/record-manage/free-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageRecord', { url: '/manage-free' });

export default function Page() {
  return <FreeRecordTable />;
}

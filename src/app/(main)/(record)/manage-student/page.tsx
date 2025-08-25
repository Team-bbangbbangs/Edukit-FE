import FreeRecordTable from '@/domains/record/components/student-manage/free-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageStudent', { url: '/manage-free' });

export default function Page() {
  return <FreeRecordTable />;
}

import SubjectRecordTable from '@/domains/record/components/record-manage/subject-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageRecord', { url: '/manage-subject' });

export default function Page() {
  return <SubjectRecordTable />;
}

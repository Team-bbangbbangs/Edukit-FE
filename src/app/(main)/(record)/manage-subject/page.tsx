import SubjectRecordTable from '@/domains/record/components/student-manage/subject-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageStudent');

export default function Page() {
  return <SubjectRecordTable />;
}

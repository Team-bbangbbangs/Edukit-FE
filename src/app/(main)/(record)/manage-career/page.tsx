import CareerRecordTable from '@/domains/record/components/student-manage/career-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageStudent');

export default function Page() {
  return <CareerRecordTable />;
}

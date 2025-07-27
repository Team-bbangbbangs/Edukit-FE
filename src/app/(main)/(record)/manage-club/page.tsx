import ClubRecordTable from '@/domains/record/components/student-manage/club-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageStudent');

export default function Page() {
  return <ClubRecordTable />;
}

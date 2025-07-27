import StudentRecordWrite from '@/domains/record/components/record-write/student-record-write';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('writeRecords');

export default function Page({ searchParams }: { searchParams: { recordId?: string } }) {
  return <StudentRecordWrite recordType="club" recordId={searchParams.recordId} />;
}

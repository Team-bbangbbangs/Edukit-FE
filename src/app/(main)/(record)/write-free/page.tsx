import StudentRecordWrite from '@/domains/record/components/record-write/student-record-write';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('writeRecords', { url: '/write-free' });

export default function Page({ searchParams }: { searchParams: { id?: string; name?: string } }) {
  const recordId = searchParams.id ? Number(searchParams.id) : undefined;
  const studentName = searchParams.name ? decodeURIComponent(searchParams.name) : undefined;

  return <StudentRecordWrite recordType="free" recordId={recordId} studentName={studentName} />;
}

import StudentRecordWrite from '@/domains/record/components/record-write/student-record-write';

export default function Page({ searchParams }: { searchParams: { recordId?: string } }) {
  return <StudentRecordWrite recordType="subject" recordId={searchParams.recordId} />;
}

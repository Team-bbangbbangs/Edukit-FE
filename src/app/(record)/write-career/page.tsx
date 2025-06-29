import StudentRecordWrite from '@/components/student-record-write/student-record-write';

export default function Page({ searchParams }: { searchParams: { recordId?: string } }) {
  return <StudentRecordWrite recordType="career" recordId={searchParams.recordId} />;
}

import { redirect } from 'next/navigation';

import StudentRecordWrite from '@/domains/record/components/record-write/student-record-write';
import { parseSearchParams } from '@/domains/record/utils/parse-url';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('writeRecords', { url: '/write-free' });

export default function Page({ searchParams }: { searchParams: { id?: string; name?: string } }) {
  const { recordId, studentName, isValid } = parseSearchParams(searchParams);

  if (!isValid) {
    redirect('/write-free');
  }

  return <StudentRecordWrite recordType="free" recordId={recordId} studentName={studentName} />;
}

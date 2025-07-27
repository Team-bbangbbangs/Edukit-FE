import BehaviorRecordTable from '@/domains/record/components/student-manage/behavior-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageStudent');

export default function Page() {
  return <BehaviorRecordTable />;
}

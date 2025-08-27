import BehaviorRecordTable from '@/domains/record/components/record-manage/behavior-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageStudent', { url: '/manage-behavior' });

export default function Page() {
  return <BehaviorRecordTable />;
}

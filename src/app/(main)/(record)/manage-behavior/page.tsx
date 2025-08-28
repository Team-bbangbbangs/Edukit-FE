import BehaviorRecordTable from '@/domains/record/components/record-manage/behavior-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageRecord', { url: '/manage-behavior' });

export default function Page() {
  return <BehaviorRecordTable />;
}

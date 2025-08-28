import CareerRecordTable from '@/domains/record/components/record-manage/career-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageRecord', { url: '/manage-career' });

export default function Page() {
  return <CareerRecordTable />;
}

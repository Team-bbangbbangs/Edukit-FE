import ClubRecordTable from '@/domains/record/components/record-manage/club-record-table';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageRecord', { url: '/manage-club' });

export default function Page() {
  return <ClubRecordTable />;
}

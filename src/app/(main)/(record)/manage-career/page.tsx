import ManageRecord from '@/domains/record/components/manage-record/manage-record';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageRecord', { url: '/manage-career' });

export default function Page() {
  return <ManageRecord recordType="career" />;
}

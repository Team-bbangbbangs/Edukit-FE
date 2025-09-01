import ManageStudent from '@/domains/record/components/manage-student/manage-student';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('manageStudent', { url: '/manage-student' });

export default function Page() {
  return <ManageStudent />;
}

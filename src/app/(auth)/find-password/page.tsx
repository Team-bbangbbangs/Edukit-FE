import FindPassword from '@/domains/auth/components/find-password/find-password';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('findPassword');

export default function Page() {
  return <FindPassword />;
}

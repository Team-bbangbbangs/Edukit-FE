import Signup from '@/domains/auth/components/signup/signup';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('signup');

export default function Page() {
  return <Signup />;
}

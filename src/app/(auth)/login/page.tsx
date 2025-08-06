import Login from '@/domains/auth/components/login/login';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('login');

export default function Page() {
  return <Login />;
}

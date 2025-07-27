import Mypage from '@/domains/profile/components/mypage';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('myPage');

export default function Page() {
  return <Mypage />;
}

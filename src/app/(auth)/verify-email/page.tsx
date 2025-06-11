import { Suspense } from 'react';

import VerifyEmail from '@/components/verify-email/verify-email';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}

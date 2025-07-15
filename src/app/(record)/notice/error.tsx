'use client';

import ErrorNotice from '@/components/notice/error-notice';

export default function Error() {
  return (
    <div className="h-screen w-full">
      <ErrorNotice />
    </div>
  );
}

'use client';

import ErrorNotice from '@/domains/notice/components/error-notice';

export default function NoticeError({ error }: { error: Error }) {
  return (
    <div className="h-screen w-full">
      <ErrorNotice />
    </div>
  );
}

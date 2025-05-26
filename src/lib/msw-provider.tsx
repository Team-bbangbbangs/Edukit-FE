'use client';

import { useEffect } from 'react';

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks').then(({ initMsw }) => initMsw());
    }
  }, []);

  return <>{children}</>;
};

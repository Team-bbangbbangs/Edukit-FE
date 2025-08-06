'use client';

import { useEffect, useState } from 'react';

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  const UseMSW =
    process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

  const [isReady, setIsReady] = useState(!UseMSW);

  useEffect(() => {
    if (!UseMSW) {
      return;
    }

    const init = async () => {
      const { initMsw } = await import('@/shared/mocks');
      await initMsw();

      setIsReady(true);
    };

    init();
  }, [UseMSW]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
};

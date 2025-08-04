'use client';

import { useEffect } from 'react';

import { initAmplitude } from '@/shared/lib/amplitude';

const isAmplitudeEnabled = process.env.NODE_ENV === 'production';

export default function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isAmplitudeEnabled) {
      console.log('📊 [Analytics Dev] : 개발 환경');
      return;
    }

    initAmplitude();
  }, []);

  return <>{children}</>;
}

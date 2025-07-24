'use client';

import { useEffect } from 'react';

import { initAmplitude } from '@/shared/lib/amplitude';

const isAmplitudeEnabled = process.env.NODE_ENV === 'production';

const devLog = (action: string) => {
  if (!isAmplitudeEnabled) {
    console.log(`📊 [Analytics Dev] ${action}:`, '개발 환경');
  }
};

export default function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isAmplitudeEnabled) {
      devLog('Analytics disabled in development');
      return;
    }

    initAmplitude();
  }, []);

  return <>{children}</>;
}

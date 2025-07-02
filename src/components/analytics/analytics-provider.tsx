'use client';

import { useEffect } from 'react';

import { initAmplitude } from '@/lib/amplitude/amplitude';

const isAnalyticsEnabled = process.env.NODE_ENV === 'production';

const devLog = (action: string) => {
  if (!isAnalyticsEnabled) {
    console.log(`📊 [Analytics Dev] ${action}:`, '개발 환경');
  }
};

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isAnalyticsEnabled) {
      devLog('Analytics disabled in development');
      return;
    }

    initAmplitude();
  }, []);

  return <>{children}</>;
}

'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { initAmplitude, trackEvent, setUserInfo } from '@/lib/amplitude/amplitude';
import { getKoreaFormattedTimeStamp } from '@/util/get-korea-formatted-time-stamp';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(0);

  // 1. Amplitude 초기화 + 기본 정보 수집
  useEffect(() => {
    initAmplitude();

    // 기기/브라우저 정보
    const userAgent = navigator.userAgent;
    const getBrowser = () => {
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Safari')) return 'Safari';
      if (userAgent.includes('Firefox')) return 'Firefox';
      return 'Other';
    };

    const getOS = () => {
      if (userAgent.includes('Windows')) return 'Windows';
      if (userAgent.includes('Mac')) return 'Mac';
      if (userAgent.includes('Android')) return 'Android';
      if (userAgent.includes('iPhone')) return 'iOS';
      return 'Other';
    };

    const getDevice = () => {
      return /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Desktop';
    };

    // 사용자 기본 정보 설정
    setUserInfo({
      browser: getBrowser(),
      os: getOS(),
      device: getDevice(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    });

    // 유입 경로 추적
    trackEvent('Session Start', {
      referrer: document.referrer || 'Direct',
      landing_page: pathname,
    });
  }, [pathname]);

  // 2. 페이지별 체류 시간 추적
  useEffect(() => {
    // 이전 페이지 체류 시간 기록
    if (startTimeRef.current > 0) {
      const duration = Date.now() - startTimeRef.current;
      trackEvent('Page Exit', {
        duration_seconds: Math.round(duration / 1000),
      });
    }

    // 새 페이지 시작
    startTimeRef.current = Date.now();
    trackEvent('Page View', {
      page: pathname,
      timestamp: getKoreaFormattedTimeStamp(),
    });

    // 페이지 나갈 때 체류 시간 기록
    return () => {
      if (startTimeRef.current > 0) {
        const duration = Date.now() - startTimeRef.current;
        trackEvent('Page Exit', {
          page: pathname,
          duration_seconds: Math.round(duration / 1000),
        });
      }
    };
  }, [pathname]);

  return <>{children}</>;
}

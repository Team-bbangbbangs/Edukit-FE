import AnalyticsProvider from '@/components/analytics/analytics-provider';
import { AuthProvider } from '@/contexts/auth/auth-provider';
import { MSWProvider } from '@/lib/msw-provider';
import QueryProvider from '@/lib/tanstack-query-provider';

import { metadata } from './metadata';

import './globals.css';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head />
      <body className="overflow-hidden">
        <MSWProvider>
          <QueryProvider>
            <AuthProvider>
              <AnalyticsProvider>{children}</AnalyticsProvider>
            </AuthProvider>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}

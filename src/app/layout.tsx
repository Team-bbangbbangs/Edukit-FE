import AnalyticsProvider from '@/shared/providers/amplitude-provider';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { MSWProvider } from '@/shared/providers/msw-provider';
import QueryProvider from '@/shared/providers/tanstack-query-provider';

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

import AmplitudeProvider from '@/shared/providers/amplitude-provider';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { MSWProvider } from '@/shared/providers/msw-provider';
import QueryProvider from '@/shared/providers/tanstack-query-provider';

import './globals.css';

export const metadata = {
  metadataBase: new URL('https://edukit.co.kr'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head />
      <body className="overflow-hidden">
        <MSWProvider>
          <QueryProvider>
            <AuthProvider>
              <AmplitudeProvider>{children}</AmplitudeProvider>
            </AuthProvider>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}

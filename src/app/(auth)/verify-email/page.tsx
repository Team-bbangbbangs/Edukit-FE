import VerifyEmail from '@/domains/auth/components/verify-email/verify-email';
import type { VerifyEmailRequest } from '@/domains/auth/types/auth';
import { createPageMetadata } from '@/shared/constants/metadata';

export const metadata = createPageMetadata('verifyEmail');

interface PageProps {
  searchParams: VerifyEmailRequest;
}

export default function Page({ searchParams }: PageProps) {
  return <VerifyEmail searchParams={searchParams} />;
}

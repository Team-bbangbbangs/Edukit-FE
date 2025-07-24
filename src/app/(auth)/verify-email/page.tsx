import VerifyEmail from '@/domains/auth/components/verify-email/verify-email';
import type { VerifyEmailRequest } from '@/domains/auth/types/auth';

interface PageProps {
  searchParams: VerifyEmailRequest;
}

export default function Page({ searchParams }: PageProps) {
  return <VerifyEmail searchParams={searchParams} />;
}

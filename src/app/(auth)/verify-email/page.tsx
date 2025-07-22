import VerifyEmail from '@/components/verify-email/verify-email';
import type { VerifyEmailRequest } from '@/types/auth/auth';

interface PageProps {
  searchParams: VerifyEmailRequest;
}

export default function Page({ searchParams }: PageProps) {
  return <VerifyEmail searchParams={searchParams} />;
}

import VerifyEmail from '@/components/verify-email/verify-email';

interface PageProps {
  searchParams: {
    email?: string;
    token?: string;
  };
}

export default function VerifyEmailPage({ searchParams }: PageProps) {
  return <VerifyEmail email={searchParams.email} token={searchParams.token} />;
}

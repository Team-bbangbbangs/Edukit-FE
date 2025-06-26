import VerifyEmail from '@/components/verify-email/verify-email';

interface PageProps {
  searchParams: {
    id?: string;
    code?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  return <VerifyEmail searchParams={searchParams} />;
}

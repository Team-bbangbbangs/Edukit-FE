import ResetPasswordForm from '@/domains/auth/components/find-password/reset-password-form';

interface ResetPasswordPageProps {
  searchParams: {
    id?: string;
    code?: string;
  };
}

export default function Page({ searchParams }: ResetPasswordPageProps) {
  const { id, code } = searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ResetPasswordForm memberUuid={id} verificationCode={code} />
    </div>
  );
}

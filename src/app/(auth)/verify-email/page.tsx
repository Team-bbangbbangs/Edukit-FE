import VerifyEmail from '@/components/verify-email/verify-email';

export default function Page() {
  return (
    <div className="flex flex-col gap-10 text-center">
      <h1>이메일 인증 확인 페이지</h1>
      <VerifyEmail />
    </div>
  );
}

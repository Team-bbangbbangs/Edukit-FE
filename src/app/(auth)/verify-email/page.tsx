import { getVerifyEmail } from '@/services/auth/get-verify-email';

interface PageProps {
  searchParams: {
    id?: string;
    code?: string;
  };
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const id = searchParams?.id;
  const code = searchParams?.code;

  let isSuccess = false;

  if (id && code) {
    try {
      await getVerifyEmail(id, code);
      isSuccess = true;
    } catch (e) {
      console.log(e);
      isSuccess = false;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 text-center">
      {isSuccess ? (
        <>
          <h1 className="text-2xl font-bold text-green-700">이메일 인증이 완료되었습니다!</h1>
          <p className="mt-2 text-gray-600">원래 있던 브라우저로 돌아가주세요.</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-700">이메일 인증에 실패했습니다.</h1>
          <p className="mt-2 text-gray-600">이제 모든 서비스를 이용하실 수 있습니다.</p>
        </>
      )}
    </div>
  );
}

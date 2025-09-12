import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { usePostFindPassword } from '@/domains/auth/apis/mutations/use-post-find-password';
import { emailSchema } from '@/domains/auth/types/auth-scheme';
import { Input } from '@/shared/components/ui/input/input';

const emailVerificationSchema = z.object({
  email: emailSchema,
});

type EmailVerificationData = z.infer<typeof emailVerificationSchema>;

interface EmailVerificationFormProps {
  onEmailSent: () => void;
}

export default function EmailVerificationForm({ onEmailSent }: EmailVerificationFormProps) {
  const [serverError, setServerError] = useState('');
  const { mutate: postFindPassword, isPending } = usePostFindPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailVerificationData>({
    resolver: zodResolver(emailVerificationSchema),
  });

  const onSubmit = (data: EmailVerificationData) => {
    setServerError('');
    postFindPassword(data.email, {
      onSuccess: () => {
        onEmailSent();
      },
      onError: (error) => {
        setServerError(error.message);
      },
    });
  };

  const inputClassName = (hasError: boolean) =>
    `mb-1 h-16 w-96 pt-3 text-xl placeholder:text-xl ${
      hasError ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0' : ''
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-6 text-center">
        <p className="text-lg text-gray-600">가입하신 이메일 주소를 입력해주세요</p>
      </div>

      <div className="space-y-1">
        <Input
          type="email"
          placeholder="이메일"
          {...register('email')}
          className={inputClassName(!!errors.email)}
        />
        {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-red-500">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-8 h-16 w-96 rounded-md bg-slate-800 px-4 py-2 text-title-18 text-white hover:bg-slate-950 disabled:opacity-50"
      >
        {isPending ? '전송 중...' : '비밀번호 재설정 이메일 보내기'}
      </button>
    </form>
  );
}

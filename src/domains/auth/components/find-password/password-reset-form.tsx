import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from 'next/navigation';

import SuccessPasswordResetModal from '@/domains/auth/components/find-password/success-password-reset-modal';
import { passwordSchema } from '@/domains/auth/components/signup/signup-scheme';
import { usePatchResetPassword } from '@/domains/auth/hooks/use-patch-reset-password';
import { Input } from '@/shared/components/ui/input/input';

const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: '비밀번호 확인을 입력해주세요.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

type PasswordResetData = z.infer<typeof passwordResetSchema>;

interface PasswordResetFormProps {
  verifiedEmail: string;
  onBack: () => void;
}

export function PasswordResetForm({ verifiedEmail, onBack }: PasswordResetFormProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [serverError, setServerError] = useState('');
  const { mutate: patchResetPassword, isPending } = usePatchResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
  });

  const handleModalButtonClick = () => {
    setModalOpen(false);
    router.push('/');
  };

  const onSubmit = (data: PasswordResetData) => {
    setServerError('');

    patchResetPassword(
      {
        email: verifiedEmail,
        password: data.password,
      },
      {
        onSuccess: () => {
          setModalOpen(true);
        },
        onError: (error) => {
          setServerError(error.message);
        },
      },
    );
  };

  const inputClassName = (hasError: boolean) =>
    `mb-1 h-16 w-96 pt-3 text-xl placeholder:text-xl ${
      hasError ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0' : ''
    }`;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-4"
      >
        <p className="text-lg text-gray-600">새로운 비밀번호를 입력해주세요</p>

        <Input
          type="password"
          placeholder="새 비밀번호"
          {...register('password')}
          className={inputClassName(!!errors.password)}
        />
        {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}
        <Input
          type="password"
          placeholder="비밀번호 확인"
          {...register('confirmPassword')}
          className={inputClassName(!!errors.confirmPassword)}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        ) : null}

        {serverError ? <p className="text-sm text-red-500">{serverError}</p> : null}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="h-16 rounded-md bg-gray-600 px-8 text-2xl font-bold text-white hover:bg-gray-700"
          >
            이전
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="h-16 rounded-md bg-slate-800 px-8 text-2xl font-bold text-white hover:bg-slate-950 disabled:opacity-50"
          >
            비밀번호 변경
          </button>
        </div>
      </form>
      <SuccessPasswordResetModal open={modalOpen} onOpenChange={handleModalButtonClick} />
    </>
  );
}

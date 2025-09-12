'use client';

import { useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { usePatchPassword } from '@/domains/auth/apis/mutations/use-patch-password';
import SuccessPasswordResetModal from '@/domains/auth/components/find-password/success-password-reset-modal';
import { passwordSchema } from '@/domains/auth/types/auth-scheme';
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

interface ResetPasswordFormProps {
  memberUuid?: string;
  verificationCode?: string;
}

export default function ResetPasswordForm({
  memberUuid,
  verificationCode,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isValidParams, setIsValidParams] = useState(false);

  const { mutate: patchPassword, isPending } = usePatchPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
  });

  useEffect(() => {
    if (!memberUuid || !verificationCode) {
      setServerError('유효하지 않은 링크입니다. 이메일의 링크를 다시 확인해주세요.');
      setIsValidParams(false);
    } else {
      setIsValidParams(true);
    }
  }, [memberUuid, verificationCode]);

  const handleModalClose = () => {
    setModalOpen(false);
    router.push('/login');
  };

  const onSubmit = (data: PasswordResetData) => {
    if (!memberUuid || !verificationCode) {
      setServerError('유효하지 않은 링크입니다.');
      return;
    }

    setServerError('');

    patchPassword(
      {
        memberUuid,
        verificationCode,
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
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-slate-700 px-10 py-16">
        <h2 className="mb-4 text-[30px] font-bold">비밀번호 재설정</h2>

        {isValidParams ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-4"
          >
            <p className="mb-4 text-lg text-gray-600">새로운 비밀번호를 입력해주세요</p>

            <div className="space-y-1">
              <Input
                type="password"
                placeholder="새 비밀번호"
                {...register('password')}
                className={inputClassName(!!errors.password)}
              />
              {errors.password ? (
                <p className="w-96 text-sm text-red-500">{errors.password.message}</p>
              ) : null}
            </div>

            <div className="space-y-1">
              <Input
                type="password"
                placeholder="비밀번호 확인"
                {...register('confirmPassword')}
                className={inputClassName(!!errors.confirmPassword)}
              />
              {errors.confirmPassword ? (
                <p className="w-96 text-sm text-red-500">{errors.confirmPassword.message}</p>
              ) : null}
            </div>

            {serverError ? <p className="w-96 text-sm text-red-500">{serverError}</p> : null}

            <button
              type="submit"
              disabled={isPending}
              className="mt-8 h-16 w-96 rounded-md bg-slate-800 px-4 py-2 text-2xl font-bold text-white hover:bg-slate-950 disabled:opacity-50"
            >
              {isPending ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg text-red-500">{serverError}</p>
          </div>
        )}

        <div className="mt-4">
          <Link
            href="/find-password"
            className="text-slate-600 hover:text-slate-800 hover:underline"
          >
            비밀번호 찾기로 돌아가기
          </Link>
        </div>
      </div>

      <SuccessPasswordResetModal open={modalOpen} onOpenChange={handleModalClose} />
    </>
  );
}

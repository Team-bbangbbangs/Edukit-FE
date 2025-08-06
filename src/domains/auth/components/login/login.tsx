'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { useLogin } from '@/domains/auth/apis/mutations/use-login';
import { loginSchema, type LoginDataType } from '@/domains/auth/components/signup/signup-scheme';
import { Input } from '@/shared/components/ui/input/input';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataType>({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = useState('');
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (formData: LoginDataType) => {
    setServerError('');
    login(formData, {
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
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-slate-700 px-10 py-16">
      <h2 className="mb-4 text-[40px] font-bold">Edukit</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Input
            placeholder="이메일"
            {...register('email')}
            className={inputClassName(!!errors.email)}
          />
          {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1">
          <Input
            type="password"
            placeholder="비밀번호"
            {...register('password')}
            className={inputClassName(!!errors.password)}
          />
          {errors.password ? (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          ) : null}
        </div>

        {serverError ? <p className="text-sm text-red-500">{serverError}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="ho mt-8 h-16 w-96 rounded-md bg-slate-800 px-4 py-2 text-2xl font-bold text-white disabled:opacity-50"
        >
          로그인
        </button>
      </form>

      <div className="flex gap-4">
        <Link href="/signup" className="hover:underline">
          회원가입
        </Link>
        <Link href="/find-password" className="hover:underline">
          비밀번호 찾기
        </Link>
      </div>
    </div>
  );
}

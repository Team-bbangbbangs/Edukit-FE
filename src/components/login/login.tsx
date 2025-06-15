'use client';

import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { Input } from '@/components/input/input';
import { useLogin } from '@/hooks/api/use-login';

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-slate-700 px-10 py-16">
      <h2 className="mb-4 text-[40px] font-bold">EduMate</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <Input
            type="email"
            placeholder="이메일"
            {...register('email', { required: '이메일을 입력해주세요' })}
            className="mb-1 h-16 w-96 pt-3 text-xl placeholder:text-xl"
          />
          {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
          <Input
            type="password"
            placeholder="비밀번호"
            {...register('password', { required: '비밀번호를 입력해주세요' })}
            className="mb-1 mt-4 h-16 w-96 pt-3 text-xl placeholder:text-xl"
          />
          {errors.password ? (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-8 h-16 w-96 rounded-md bg-blue-900 px-4 py-2 text-2xl font-bold text-white"
        >
          로그인
        </button>
      </form>

      <div className="flex gap-4">
        <span className="hover:underline">아이디(이메일) 찾기</span>
        <Link href="/signup" className="hover:underline">
          회원가입
        </Link>
        <span className="hover:underline">비밀번호 찾기</span>
      </div>
    </div>
  );
}

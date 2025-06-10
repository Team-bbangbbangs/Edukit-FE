'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { Input } from '@/components/input/input';

import { signUpScheme } from './signup-scheme';

import type { SignUpDataType } from './signup-scheme';

export default function SignUp() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpDataType>({
    resolver: zodResolver(signUpScheme),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      subject: '',
      school: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: SignUpDataType) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-[400px] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="email">
          이메일
        </label>
        <Input
          id="email"
          className={`h-12 ${errors.email ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0' : ''}`}
          type="email"
          placeholder="교직 이메일을 작성해주세요"
          {...register('email')}
        />
        {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="password">
          비밀번호
        </label>
        <Input
          id="password"
          className={`h-12 pt-3 text-[20px] ${errors.password ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0' : ''}`}
          type="password"
          placeholder="********"
          {...register('password')}
        />
        {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="confirmPassword">
          비밀번호 확인
        </label>
        <Input
          id="confirmPassword"
          className={`h-12 pt-3 text-[20px] ${errors.confirmPassword ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0' : ''}`}
          type="password"
          placeholder="********"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="subject">
          담당 교과목
        </label>
        <Input className="h-12" type="text" {...register('subject')} />
        {errors.subject ? <p className="text-sm text-red-500">{errors.subject.message}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label id="school-label" className="font-bold">
          중 / 고등학교 선택
        </label>
        <Controller
          control={control}
          name="school"
          render={({ field }) => (
            <div className="flex w-full overflow-hidden rounded-md border">
              <button
                type="button"
                role="radio"
                aria-checked={field.value === 'middle'}
                aria-labelledby="school-label"
                onClick={() => field.onChange('middle')}
                className={`flex-1 border-r py-2 text-center ${
                  field.value === 'middle' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                중학교
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={field.value === 'high'}
                aria-labelledby="school-label"
                onClick={() => field.onChange('high')}
                className={`flex-1 py-2 text-center ${
                  field.value === 'high' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                고등학교
              </button>
            </div>
          )}
        />
        {errors.school ? <p className="text-sm text-red-500">{errors.school.message}</p> : null}
      </div>
      <button
        type="submit"
        className="mt-4 h-12 rounded-md bg-slate-800 font-semibold text-white hover:bg-slate-950"
      >
        가입하기
      </button>
    </form>
  );
}

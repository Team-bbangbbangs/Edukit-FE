'use client';

import { useState, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSignup } from '@/domains/auth/apis/mutations/use-signup';
import { subjects } from '@/domains/auth/constants/signup-data';
import Dropdown from '@/shared/components/ui/dropdown/dropdown';
import { Input } from '@/shared/components/ui/input/input';

import { signupSchema } from './signup-scheme';
import SuccessSignup from './success-signup';

import type { SignupDataType } from './signup-scheme';

export default function Signup() {
  const { mutate: signup, isPending } = useSignup();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<SignupDataType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      subject: '',
      school: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: SignupDataType) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...signupData } = data;
    signup(signupData, {
      onSuccess: () => {
        setIsSuccess(true);
      },
    });
  };

  const selectedSubjectValue = watch('subject');
  const selectedSchoolValue = watch('school');

  const [comboBoxInput, setComboBoxInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSubjects = subjects.filter((subject) => subject.label.includes(comboBoxInput));

  const handleButtonClick = () => {
    setComboBoxInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleSelectSubject = (value: string, label: string) => {
    setValue('subject', value);
    setComboBoxInput(label);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComboBoxInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  if (isSuccess) {
    return <SuccessSignup />;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-[26px] font-bold">회원가입</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-[400px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="email">
            이메일
          </label>
          <Input
            id="email"
            className={`h-12 ${
              errors.email
                ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0'
                : ''
            }`}
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
            className={`h-12 pt-3 text-[20px] ${
              errors.password
                ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0'
                : ''
            }`}
            type="password"
            placeholder="********"
            {...register('password')}
          />
          {errors.password ? (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="confirmPassword">
            비밀번호 확인
          </label>
          <Input
            id="confirmPassword"
            className={`h-12 pt-3 text-[20px] ${
              errors.confirmPassword
                ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0'
                : ''
            }`}
            type="password"
            placeholder="********"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" id="subject">
            담당 교과목
          </label>

          <Dropdown initialFocusIndex={0}>
            <Dropdown.Trigger className="h-12" onClick={() => handleButtonClick()}>
              {selectedSubjectValue
                ? subjects.find((subject) => subject.value === selectedSubjectValue)?.label
                : '담당 교과목 선택'}
            </Dropdown.Trigger>

            <Dropdown.Content itemCount={filteredSubjects.length}>
              <input
                ref={inputRef}
                onKeyDown={handleInputKeyDown}
                type="text"
                value={comboBoxInput}
                onChange={handleInputChange}
                placeholder="과목을 입력하세요"
                className="z-50 h-12 w-full rounded-t-md pl-2 focus:outline-none focus:ring-0"
              />
              <div className="max-h-44 overflow-y-scroll border-t px-1 py-2">
                {filteredSubjects.length === 0 ? (
                  <div className="flex h-44 items-center justify-center text-slate-700">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  filteredSubjects.map((subject, index) => (
                    <Dropdown.Item
                      key={subject.value}
                      index={index}
                      onClick={() => handleSelectSubject(subject.value, subject.label)}
                      selected={selectedSubjectValue === subject.value}
                      className="h-10 items-center rounded-md text-left"
                    >
                      {subject.label}
                    </Dropdown.Item>
                  ))
                )}
              </div>
            </Dropdown.Content>
          </Dropdown>

          {errors.subject ? <p className="text-sm text-red-500">{errors.subject.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label id="school-label" className="font-bold">
            중 / 고등학교 선택
          </label>
          <div className="flex w-full overflow-hidden rounded-md border">
            <button
              type="button"
              role="radio"
              aria-checked={selectedSchoolValue === 'middle'}
              aria-labelledby="school-label"
              onClick={() => setValue('school', 'middle', { shouldValidate: true })}
              className={`flex-1 border-r py-2 text-center ${
                selectedSchoolValue === 'middle' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              중학교
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={selectedSchoolValue === 'high'}
              aria-labelledby="school-label"
              onClick={() => setValue('school', 'high', { shouldValidate: true })}
              className={`flex-1 py-2 text-center ${
                selectedSchoolValue === 'high' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              고등학교
            </button>
          </div>
          {errors.school ? <p className="text-sm text-red-500">{errors.school.message}</p> : null}
        </div>

        <button
          type="submit"
          className="mt-4 h-12 rounded-md bg-slate-800 font-semibold text-white hover:bg-slate-950"
          disabled={isPending}
        >
          가입하기
        </button>
      </form>
    </div>
  );
}

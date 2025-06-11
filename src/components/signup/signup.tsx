'use client';

import { useState, useRef, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/input/input';
import { subjects } from '@/constants/signup-data';

import { signUpScheme } from './signup-scheme';

import type { SignUpDataType } from './signup-scheme';

export default function SignUp() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
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

  const selectedSubjectValue = watch('subject');

  const [open, setOpen] = useState(false);
  const [comboBoxInput, setComboBoxInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredSubjects = subjects.filter((subject) => subject.label.includes(comboBoxInput));

  const handleButtonClick = () => {
    setOpen(true);
    setSelectedIndex(0);
    setComboBoxInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSelectSubject = (value: string, label: string) => {
    setValue('subject', value);
    setComboBoxInput(label);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComboBoxInput(e.target.value);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredSubjects.length === 0) {
      if (e.key === 'Enter') e.preventDefault();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev === filteredSubjects.length - 1 ? prev : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev === 0 ? prev : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredSubjects[selectedIndex];
      if (selected) {
        handleSelectSubject(selected.value, selected.label);
      }
    }
  };

  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIndex]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-[400px] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="email">
          이메일
        </label>
        <Input
          id="email"
          className={`h-12 ${
            errors.email ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0' : ''
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
        {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}
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

      <div className="relative flex flex-col gap-2">
        <label className="font-bold" id="subject">
          담당 교과목
        </label>
        <button
          type="button"
          className="h-12 w-full rounded-md border bg-white text-black hover:bg-slate-200"
          onClick={handleButtonClick}
        >
          {selectedSubjectValue
            ? subjects.find((subject) => subject.value === selectedSubjectValue)?.label
            : '담당 교과목 선택'}
        </button>
        {open ? (
          <div className="absolute top-[86px] w-full rounded-lg border bg-slate-100">
            <input
              ref={inputRef}
              type="text"
              value={comboBoxInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setOpen(false)}
              className="h-12 w-full rounded-t-lg pl-2"
            />
            <div className="max-h-52 overflow-y-scroll border-t px-1 py-2">
              {filteredSubjects.length === 0 ? (
                <div className="flex h-52 items-center justify-center text-slate-700">
                  검색 결과가 없습니다.
                </div>
              ) : (
                filteredSubjects.map((subject, index) => (
                  <div
                    key={subject.value}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    onMouseDown={() => {
                      handleSelectSubject(subject.value, subject.label);
                    }}
                    className={`flex h-10 cursor-pointer items-center rounded-md hover:bg-slate-200 ${
                      index === selectedIndex ? 'bg-slate-300' : ''
                    }`}
                  >
                    <span className="pl-2">{subject.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
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
            aria-checked={watch('school') === 'middle'}
            aria-labelledby="school-label"
            onClick={() => setValue('school', 'middle', { shouldValidate: true })}
            className={`flex-1 border-r py-2 text-center ${
              watch('school') === 'middle' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            중학교
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={watch('school') === 'high'}
            aria-labelledby="school-label"
            onClick={() => setValue('school', 'high', { shouldValidate: true })}
            className={`flex-1 py-2 text-center ${
              watch('school') === 'high' ? 'bg-black text-white' : 'bg-white text-black'
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
      >
        가입하기
      </button>
    </form>
  );
}

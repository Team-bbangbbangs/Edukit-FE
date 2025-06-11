import { z } from 'zod';

import { allowedDomains } from '@/constants/signup-data';

export const signupScheme = z
  .object({
    email: z
      .string()
      .email({ message: '이메일 형식이 유효하지 않습니다.' })
      .refine(
        (email) => {
          const parts = email.split('@');
          if (parts.length !== 2) return false;
          const domain = parts[1];
          return allowedDomains.includes(domain);
        },
        { message: '교직 이메일이 아닙니다.' },
      ),
    password: z
      .string()
      .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
      .max(20, { message: '비밀번호는 최대 20자 이하이어야 합니다.' })
      .refine(
        (password) => {
          let count = 0;
          if (/[a-zA-Z]/.test(password)) count++;
          if (/\d/.test(password)) count++;
          if (/[^a-zA-Z0-9]/.test(password)) count++;
          return count >= 2;
        },
        { message: '영문/숫자/특수문자 중 2가지 이상 포함해야 합니다.' },
      )
      .refine(
        (password) => {
          return !/(.)\1\1/.test(password);
        },
        { message: '동일 문자를 3번 연속으로 사용할 수 없습니다.' },
      ),
    confirmPassword: z.string(),
    subject: z.string().min(1, { message: '교과목을 입력해주세요.' }),
    school: z.string().min(1, { message: '학교를 선택해주세요.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type SignupDataType = z.infer<typeof signupScheme>;

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/input/input';
import { passwordSchema } from '@/components/signup/signup-scheme';
import { usePatchAfterLoginPassword } from '@/hooks/api/profile/use-patch-after-login-password';

const passwordEditSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type PasswordEditType = z.infer<typeof passwordEditSchema>;

interface PasswordEditProps {
  onView: () => void;
}

export default function BasicInfoPasswordEdit({ onView }: PasswordEditProps) {
  const { mutate: patchAfterLoginPassword, isPending } = usePatchAfterLoginPassword();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<PasswordEditType>({
    resolver: zodResolver(passwordEditSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: PasswordEditType) => {
    patchAfterLoginPassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          alert('비밀번호가 성공적으로 변경되었습니다.');
          reset();
          onView();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex w-full items-center gap-7">
        <span className="text-slate-500">비밀번호</span>
        <div className="flex flex-1 flex-col gap-1">
          <div className="space-y-3">
            <Input
              className={`h-10 text-lg ${
                errors.currentPassword
                  ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0'
                  : ''
              }`}
              type="password"
              placeholder="현재 비밀번호"
              {...register('currentPassword')}
            />
            <Input
              className={`h-10 text-lg ${
                errors.newPassword
                  ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0'
                  : ''
              }`}
              type="password"
              placeholder="새 비밀번호"
              {...register('newPassword')}
            />
            <Input
              className={`h-10 text-lg ${
                errors.confirmPassword
                  ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0'
                  : ''
              }`}
              type="password"
              placeholder="새 비밀번호 확인"
              {...register('confirmPassword')}
            />
          </div>
          {errors.currentPassword || errors.newPassword || errors.confirmPassword ? (
            <div className="space-y-1">
              {errors.currentPassword ? (
                <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
              ) : null}
              {errors.newPassword ? (
                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
              ) : null}
              {errors.confirmPassword ? (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onView}
            className="rounded-lg bg-gray-200 px-4 py-1 text-gray-600 hover:bg-gray-300"
            disabled={isPending}
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-4 py-1 text-white hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={isPending}
          >
            저장
          </button>
        </div>
      </div>
    </form>
  );
}

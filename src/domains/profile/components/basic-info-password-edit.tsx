import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { passwordSchema } from '@/domains/auth/types/auth-scheme';
import { usePatchAfterLoginPassword } from '@/domains/profile/apis/mutations/use-patch-after-login-password';
import { Input } from '@/shared/components/ui/input/input';

const passwordEditSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: '새로운 비밀번호는 기존 비밀번호와 같을 수 없습니다.',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.',
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
    setError,
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
        onError: (error) => {
          setError('currentPassword', {
            type: 'server',
            message: error.message || '현재 비밀번호가 일치하지 않습니다.',
          });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex w-full items-center gap-7">
        <span className="text-slate-500">비밀번호</span>
        <div className="flex flex-1 flex-col gap-3">
          <div className="relative">
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
            {errors.currentPassword ? (
              <p data-testid="current-password-error" className="mt-1 text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>

          <div className="relative">
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
            {errors.newPassword ? (
              <p data-testid="new-password-error" className="mt-1 text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className="relative">
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
            {errors.confirmPassword ? (
              <p data-testid="confirm-password-error" className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>
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

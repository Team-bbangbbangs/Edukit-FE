import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { emailSchema } from '@/domains/auth/components/signup/signup-scheme';
import { usePatchEmail } from '@/domains/profile/hooks/use-patch-email';
import { Input } from '@/shared/components/ui/input/input';

const emailEditSchema = z.object({
  email: emailSchema,
});

type EmailEditType = z.infer<typeof emailEditSchema>;

interface EmailEditProps {
  currentEmail: string;
  onView: () => void;
}

export default function BasicInfoEmailEdit({ currentEmail, onView }: EmailEditProps) {
  const { mutate: patchEmail, isPending } = usePatchEmail();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailEditType>({
    resolver: zodResolver(emailEditSchema),
    defaultValues: {
      email: currentEmail,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: EmailEditType) => {
    patchEmail(data.email, {
      onSuccess: () => {
        alert('이메일이 성공적으로 변경되었습니다.');
        onView();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full items-center gap-4">
      <span className="text-slate-500">이메일</span>
      <div className="relative ml-4 flex flex-1">
        <Input
          className={`h-8 text-lg ${
            errors.email ? 'border border-red-500 focus-visible:border-2 focus-visible:ring-0' : ''
          }`}
          type="email"
          placeholder="새로운 이메일을 입력해주세요"
          {...register('email')}
        />
        {errors.email ? (
          <p className="absolute top-9 text-xs text-red-500">{errors.email.message}</p>
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
    </form>
  );
}

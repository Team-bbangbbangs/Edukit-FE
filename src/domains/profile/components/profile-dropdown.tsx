import { useState } from 'react';

import { Home } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import { useLogout } from '@/domains/auth/hooks/use-logout';
import EmailSentModal from '@/domains/profile/components/email-sent-modal';
import { useGetProfile } from '@/domains/profile/hooks/use-get-profile';
import { usePostSendEmail } from '@/domains/profile/hooks/use-post-send-email';
import DefaultError from '@/shared/components/ui/error/default-error';
import Loading from '@/shared/components/ui/loading/loading';

import ProfileImage from '../../../../public/images/profile-image.png';

const SCHOOL_LABELS: Record<string, string> = {
  middle: '중학교',
  high: '고등학교',
};

interface ProfileDropDownProps {
  onClose: () => void;
}

export function ProfileDropDown({ onClose }: ProfileDropDownProps) {
  const { data, isPending, isError } = useGetProfile();
  const { mutate: handleLogout } = useLogout();
  const [open, setOpen] = useState(false);

  const { mutate: postSendEmail } = usePostSendEmail();

  const handleSendEmail = () => {
    postSendEmail(undefined, {
      onSuccess: () => {
        setOpen(true);
      },
      onError: (error) => {
        alert(error.message);
      },
    });
  };

  if (isError) {
    return (
      <div className="absolute right-0 top-[50px] z-10 flex h-[148px] w-[300px] flex-col gap-4 rounded-lg border bg-white p-4 shadow-lg">
        <DefaultError />
      </div>
    );
  }

  if (!data) return null;

  const { nickname, isTeacherVerified, school } = data;

  return (
    <div className="absolute right-0 top-[50px] z-10 flex h-[148px] w-[300px] flex-col gap-4 rounded-lg border bg-white p-4 shadow-lg">
      {isPending ? (
        <Loading />
      ) : (
        <>
          <div className="flex gap-4">
            <Link href={'/mypage'} onClick={() => onClose()}>
              <Image
                src={ProfileImage}
                alt={`${nickname}의 프로필 이미지`}
                width={60}
                height={60}
              />
            </Link>
            <div className="flex flex-col justify-center">
              <Link href={'/mypage'} onClick={() => onClose()}>
                <div className="flex items-center gap-1 font-bold">
                  <Home size={20} />
                  <span className="pt-[2px] text-[20px]">{nickname}</span>
                  <span className="pt-[2px] text-[24px]">{'>'}</span>
                </div>
              </Link>
              {isTeacherVerified ? (
                <span className="text-sm text-gray-600">{SCHOOL_LABELS[school]} 교사</span>
              ) : (
                <span
                  className="cursor-pointer text-sm text-red-500 hover:underline"
                  onClick={handleSendEmail}
                >
                  교사 인증 필요
                </span>
              )}
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="rounded-sm bg-slate-100 px-10 py-2 text-sm">2025-1학기</div>
            <button
              type="button"
              className="rounded-sm bg-slate-100 px-8 py-2 text-sm hover:bg-slate-200"
              onClick={() => handleLogout()}
            >
              로그아웃
            </button>
          </div>
          <EmailSentModal open={open} onOpenChange={setOpen} />
        </>
      )}
    </div>
  );
}

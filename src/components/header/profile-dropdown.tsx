import { Home } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import DefaultError from '@/components/error/default-error';
import { useGetProfile } from '@/hooks/api/use-get-profile';
import { useLogout } from '@/hooks/api/use-logout';

import ProfileImage from '../../../public/images/profile-image.png';

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

  if (isPending) {
    return (
      <div className="absolute right-0 top-[50px] z-10 w-[300px] rounded-lg border bg-white p-4 shadow-lg">
        <div className="text-center text-sm text-gray-500">로딩중...</div>
      </div>
    );
  }
  if (isError) {
    return <DefaultError />;
  }

  if (!data) return null;

  const { nickname, isTeacherVerified, school } = data;

  return (
    <div className="absolute right-0 top-[50px] z-10 flex w-[300px] flex-col gap-4 rounded-lg border bg-white p-4 shadow-lg">
      <div className="flex gap-4">
        <Link href={'/mypage'} onClick={() => onClose()}>
          <Image src={ProfileImage} alt={`${nickname}의 프로필 이미지`} width={60} height={60} />
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
            <Link href={'/mypage'} onClick={() => onClose()}>
              <span className="text-sm text-red-500 hover:underline">교사 인증 필요</span>
            </Link>
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
    </div>
  );
}

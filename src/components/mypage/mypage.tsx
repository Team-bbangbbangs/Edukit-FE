'use client';

import { CheckCircle2 } from 'lucide-react';

import Image from 'next/image';

import { useGetProfile } from '@/hooks/api/use-get-profile';

import ProfileImage from '../../../public/images/profile-image.png';

export default function Mypage() {
  const { data, isPending, isError } = useGetProfile();

  if (isError) {
    return <div>데이터를 불러오지 못했습니다..!</div>;
  }
  if (isPending) {
    return <div>데이터를 불러오는 중입니다..!</div>;
  }

  return (
    <div className="flex flex-col gap-5 px-10">
      <h2 className="text-[30px] font-bold">내 프로필</h2>
      <div className="mt-5 flex gap-4">
        <Image src={ProfileImage} alt="profile image" width={100} />
        <div className="flex flex-col justify-center gap-1">
          <span className="text-lg font-bold">{data.nickName}</span>
          <div>
            <span className="text-sm text-slate-600">인증 상태 : </span>
            {data.isTeacherVerified ? (
              <span className="text-sm font-bold">교사 인증 완료</span>
            ) : (
              <span className="text-sm text-red-500 underline hover:cursor-pointer">
                교사 인증 필요
              </span>
            )}
          </div>
          <div>
            <span className="text-sm text-slate-600">과목 : </span>
            <span>{data.subject}</span>
          </div>
        </div>
      </div>
      <div className="mb-14 flex gap-4">
        <div
          className={`flex gap-2 rounded-full px-4 py-2 ${data.school === 'middle' ? 'bg-slate-800 text-white' : 'bg-slate-200'}`}
        >
          <CheckCircle2 width={20} />
          <span className="pt-[2px] text-sm">중학교</span>
        </div>
        <div
          className={`flex gap-2 rounded-full px-4 py-2 ${data.school === 'high' ? 'bg-slate-800 text-white' : 'bg-slate-200'}`}
        >
          <CheckCircle2 width={20} />
          <span className="pt-[2px] text-sm">고등학교</span>
        </div>
      </div>
      <h2 className="text-[30px] font-bold">기본 정보</h2>
      <hr />
      <div className="flex w-full gap-10 px-4">
        <span className="text-slate-500">이메일</span>
        <span className="text-lg">{data.email}</span>
      </div>
      <hr />
      <div className="flex w-full gap-10 px-4">
        <span className="text-slate-500">비밀번호</span>
        <span className="pt-1 text-lg">********</span>
      </div>
      <hr />
    </div>
  );
}

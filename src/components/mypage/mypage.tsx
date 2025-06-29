'use client';

import { useState } from 'react';

import { CheckCircle2 } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import Loading from '@/components/loading/loading';
import EmailSentModal from '@/components/modal/email-sent-modal';
import { useGetProfile } from '@/hooks/api/use-get-profile';
import { usePostSendEmail } from '@/hooks/api/use-post-send-email';

import ProfileImage from '../../../public/images/profile-image.png';

export default function Mypage() {
  const { data, isPending, isError } = useGetProfile();
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
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-[26px] font-bold">로그인 후 접근 가능합니다.</p>
        <Link
          href={'/login'}
          className="rounded-md bg-slate-800 px-8 py-4 text-[20px] font-bold text-white hover:bg-slate-950"
        >
          로그인하기
        </Link>
      </div>
    );
  }
  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-5 px-10">
      <h2 className="text-[30px] font-bold">내 프로필</h2>
      <div className="mt-5 flex gap-4">
        <Image src={ProfileImage} alt="profile image" width={100} />
        <div className="flex flex-col justify-center gap-1">
          <span className="text-lg font-bold">{data.nickname}</span>
          <div>
            <span className="text-sm text-slate-600">인증 상태 : </span>
            {data.isTeacherVerified ? (
              <span className="text-sm font-bold">교사 인증 완료</span>
            ) : (
              <span
                onClick={handleSendEmail}
                className="text-sm text-red-500 underline hover:cursor-pointer"
              >
                교사 인증 필요
              </span>
            )}
          </div>
          <div>
            <span className="text-sm text-slate-600">과목 : </span>
            <span className="text-sm font-bold">{data.subject}</span>
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
      <div className="flex w-full gap-7 px-4">
        <span className="text-slate-500">비밀번호</span>
        <span className="pt-1 text-lg">********</span>
      </div>
      <hr />
      <EmailSentModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

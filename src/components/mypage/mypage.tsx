'use client';

import { useState } from 'react';

import Link from 'next/link';

import Loading from '@/components/loading/loading';
import { useGetProfile } from '@/hooks/api/profile/use-get-profile';

import BasicInfo from './basic-info';
import ProfileEdit from './profile-edit';
import ProfileView from './profile-view';

export default function Mypage() {
  const { data, isPending, isError } = useGetProfile();

  const [isEditing, setIsEditing] = useState(false);

  const handleOnEdit = () => {
    setIsEditing(true);
  };

  const handleOnView = () => {
    setIsEditing(false);
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

      {isEditing ? (
        <ProfileEdit profile={data} onChangeView={handleOnView} />
      ) : (
        <ProfileView profile={data} onChangeEdit={handleOnEdit} />
      )}

      <h2 className="text-[30px] font-bold">기본 정보</h2>
      <BasicInfo email={data.email} />
    </div>
  );
}

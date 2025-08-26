import { useState } from 'react';

import { CheckCircle2 } from 'lucide-react';

import Image from 'next/image';

import { usePostSendEmail } from '@/domains/auth/apis/mutations/use-post-send-email';
import { useDeleteWithdraw } from '@/domains/profile/apis/mutations/use-delete-withdraw';
import ConfirmWithdrawModal from '@/domains/profile/components/confirm-withdraw-modal';
import EmailSentModal from '@/domains/profile/components/email-sent-modal';
import type { ProfileResponse } from '@/domains/profile/types/profile';

import ProfileImage from '../../../../public/images/profile-image.png';

interface ProfileViewProps {
  profile: ProfileResponse;
  onChangeEdit: () => void;
}

export default function ProfileView({ profile, onChangeEdit }: ProfileViewProps) {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [confirmWithdrawModalOpen, setConfirmWithdrawModalOpen] = useState(false);

  const { mutate: postSendEmail } = usePostSendEmail();
  const { mutate: deleteWithdraw, isPending: isWithdrawPending } = useDeleteWithdraw();

  const handleSendEmail = () => {
    postSendEmail(undefined, {
      onSuccess: () => {
        setEmailModalOpen(true);
      },
      onError: (error) => {
        alert(error.message);
      },
    });
  };

  const handleWithdrawClick = () => {
    setConfirmWithdrawModalOpen(true);
  };

  const handleConfirmWithdraw = () => {
    deleteWithdraw(undefined, {
      onSuccess: () => {
        alert('회원 탈퇴가 완료되었습니다.');
      },
      onError: (error) => {
        alert(error.message);
      },
      onSettled: () => {
        setConfirmWithdrawModalOpen(false);
      },
    });
  };

  return (
    <div className="mb-10 flex flex-col gap-5">
      <div className="flex gap-4">
        <Image src={ProfileImage} alt="profile image" width={100} />
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">{profile.nickname}</span>
          </div>
          <div>
            <span className="text-sm text-slate-600">인증 상태 : </span>
            {profile.isTeacherVerified ? (
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
            <span className="text-sm font-bold">{profile.subject}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div
          className={`flex gap-2 rounded-full px-4 py-2 ${profile.school === 'middle' ? 'bg-slate-800 text-white' : 'bg-slate-200'}`}
        >
          <CheckCircle2 width={20} />
          <span className="pt-[2px] text-sm">중학교</span>
        </div>
        <div
          className={`flex gap-2 rounded-full px-4 py-2 ${profile.school === 'high' ? 'bg-slate-800 text-white' : 'bg-slate-200'}`}
        >
          <CheckCircle2 width={20} />
          <span className="pt-[2px] text-sm">고등학교</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onChangeEdit}
          className="w-40 rounded-md bg-blue-800 px-6 py-2 text-white hover:bg-blue-950"
        >
          프로필 수정하기
        </button>
        <button
          onClick={handleWithdrawClick}
          className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700"
          disabled={isWithdrawPending}
        >
          회원 탈퇴하기
        </button>
      </div>

      <EmailSentModal open={emailModalOpen} onOpenChange={setEmailModalOpen} />
      <ConfirmWithdrawModal
        open={confirmWithdrawModalOpen}
        onOpenChange={setConfirmWithdrawModalOpen}
        onConfirm={handleConfirmWithdraw}
      />
    </div>
  );
}

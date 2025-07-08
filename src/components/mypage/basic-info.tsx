import { useState } from 'react';

import BasicInfoEmailEdit from './basic-info-email-edit';
import BasicInfoPasswordEdit from './basic-info-password-edit';

export default function BasicInfo({ email }: { email: string }) {
  const [editMode, setEditMode] = useState<'email' | 'password' | null>(null);

  const handleOnView = () => {
    setEditMode(null);
  };

  return (
    <div>
      <hr />
      {editMode === 'email' ? (
        <div className="px-4 py-6">
          <BasicInfoEmailEdit currentEmail={email} onView={handleOnView} />
        </div>
      ) : (
        <div className="flex w-full items-center justify-between gap-10 px-4 py-6">
          <div className="flex gap-10 pt-1">
            <span className="text-slate-500">이메일</span>
            <span className="text-lg">{email}</span>
          </div>
          {editMode !== 'password' ? (
            <button
              onClick={() => setEditMode('email')}
              className="rounded-lg bg-slate-800 px-4 py-1 text-white hover:bg-slate-950"
            >
              수정
            </button>
          ) : null}
        </div>
      )}
      <hr />
      {editMode === 'password' ? (
        <div className="px-4 py-6">
          <BasicInfoPasswordEdit onView={handleOnView} />
        </div>
      ) : (
        <div className="flex w-full items-center justify-between gap-7 px-4 py-6">
          <div className="flex gap-7 pt-1">
            <span className="text-slate-500">비밀번호</span>
            <span className="text-lg text-slate-400">비밀번호를 설정해주세요.</span>
          </div>
          {editMode !== 'email' ? (
            <button
              onClick={() => setEditMode('password')}
              className="rounded-lg bg-slate-800 px-4 py-1 text-white hover:bg-slate-950"
            >
              수정
            </button>
          ) : null}
        </div>
      )}
      <hr />
    </div>
  );
}

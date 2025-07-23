import { useState, useEffect, useRef } from 'react';

import { CheckCircle2, ChevronDown } from 'lucide-react';

import { subjects } from '@/domains/auth/constants/signup-data';
import { useGetCheckValidNickname } from '@/domains/profile/hooks/use-get-check-valid-nickname';
import { usePatchProfile } from '@/domains/profile/hooks/use-patch-profile';
import type { ProfileResponse } from '@/domains/profile/types/profile';
import { Input } from '@/shared/components/ui/input/input';

interface ProfileEditProps {
  profile: ProfileResponse;
  onChangeView: () => void;
}

export default function ProfileEdit({ profile, onChangeView }: ProfileEditProps) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [subject, setSubject] = useState(profile.subject);
  const [school, setSchool] = useState(profile.school);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isNicknameValidated, setIsNicknameValidated] = useState(true);

  const { mutate: getCheckValidNickname, isPending: isCheckingValidNickname } =
    useGetCheckValidNickname();

  const { mutate: patchProfile, isPending } = usePatchProfile();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSchoolChange = (school: 'middle' | 'high') => {
    setSchool(school);
  };

  const handleNicknameCheck = () => {
    getCheckValidNickname(nickname, {
      onSuccess: (data) => {
        if (!data.isDuplicated && !data.isInvalid) {
          setIsNicknameValidated(true);
          alert('사용 가능한 닉네임입니다!');
        } else if (data.isDuplicated) {
          setIsNicknameValidated(false);
          alert('현재 사용 중인 닉네임입니다.');
        } else if (data.isInvalid) {
          setIsNicknameValidated(false);
          alert('금칙어가 들어갔습니다. 다른 닉네임을 사용해주세요.');
        }
      },
    });
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (e.target.value !== profile.nickname) {
      setIsNicknameValidated(false);
    } else {
      setIsNicknameValidated(true);
    }
  };

  const handleSave = () => {
    if (nickname !== profile.nickname && !isNicknameValidated) {
      alert('닉네임 중복확인을 해주세요.');
      return;
    }

    patchProfile(
      {
        nickname,
        subject,
        school,
      },
      {
        onSuccess: onChangeView,
      },
    );
  };

  const handleSubjectSelect = (selectedSubject: string) => {
    setSubject(selectedSubject);
    setIsSubjectDropdownOpen(false);
  };

  return (
    <div className="mb-[30px] mt-5 space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="w-16 text-sm text-slate-600">닉네임</span>
          <Input
            value={nickname}
            onChange={handleNicknameChange}
            className="max-w-xs flex-1"
            placeholder="닉네임을 입력하세요"
          />
          <button
            onClick={handleNicknameCheck}
            disabled={!nickname.trim() || isCheckingValidNickname}
            className="rounded-md bg-slate-800 px-4 py-1.5 text-white hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isCheckingValidNickname ? '중복 확인 중...' : '중복 확인'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-slate-600">과목</span>
        <div className="relative max-w-xs flex-1" ref={dropdownRef}>
          <button
            onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {subject || '과목을 선택하세요'}
            <div className="float-right">
              <ChevronDown />
            </div>
          </button>

          {isSubjectDropdownOpen ? (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {subjects.map((subjectOption) => (
                <button
                  key={subjectOption.value}
                  onClick={() => handleSubjectSelect(subjectOption.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                    subject === subjectOption.value ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  {subjectOption.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-start gap-4">
        <span className="w-16 pt-2 text-sm text-slate-600">학교</span>
        <div className="flex gap-4">
          <button
            onClick={() => handleSchoolChange('middle')}
            className={`flex gap-2 rounded-full px-4 py-2 transition-colors ${
              school === 'middle' ? 'bg-slate-800 text-white' : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            <CheckCircle2 width={20} />
            <span className="pt-[2px] text-sm">중학교</span>
          </button>
          <button
            onClick={() => handleSchoolChange('high')}
            className={`flex gap-2 rounded-full px-4 py-2 transition-colors ${
              school === 'high' ? 'bg-slate-800 text-white' : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            <CheckCircle2 width={20} />
            <span className="pt-[2px] text-sm">고등학교</span>
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onChangeView}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
          disabled={isPending}
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={isPending || !isNicknameValidated}
        >
          저장
        </button>
      </div>
    </div>
  );
}

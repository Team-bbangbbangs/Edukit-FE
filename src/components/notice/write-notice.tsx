'use client';

import { useState, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { Input } from '@/components/input/input';
import { Textarea } from '@/components/textarea/textarea';
import { usePostAdminNotice } from '@/hooks/api/use-post-admin-notice';

const baseStyle = 'rounded-full px-5 py-1 pt-1.5 text-center font-bold text-[14px]';

const activeStyle = 'bg-slate-800 text-white border border-white';

const nonActiveStyle = 'bg-white text-black border border-slate-400';

export default function WriteNotice() {
  const router = useRouter();
  const [selectedTag, isSelectedTag] = useState(2);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: postAdminNotice } = usePostAdminNotice();

  const handleSubmit = () => {
    const title = inputRef.current?.value;
    const content = textareaRef.current?.value;
    if (!title || !content) {
      alert('제목, 내용을 입력해주세요');
      return;
    }
    postAdminNotice(
      { title, content, categoryId: selectedTag },
      {
        onSuccess: () => {
          router.push('/notice');
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="flex gap-4">
        <button
          onClick={() => isSelectedTag(2)}
          className={`${baseStyle} ${selectedTag === 2 ? activeStyle : nonActiveStyle}`}
        >
          공지
        </button>
        <button
          onClick={() => isSelectedTag(3)}
          className={`${baseStyle} ${selectedTag === 3 ? activeStyle : nonActiveStyle}`}
        >
          이벤트
        </button>
      </div>
      <Input ref={inputRef} placeholder="제목" />

      {/* 에디터 라이브러리 붙이면 수정할 예정 */}
      <Textarea ref={textareaRef} placeholder="내용을 입력해주세요." className="h-96" />
      <button
        onClick={handleSubmit}
        className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-950"
      >
        작성하기
      </button>
    </div>
  );
}

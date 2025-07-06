'use client';

import { useState, useRef } from 'react';

import { useRouter } from 'next/navigation';

import TipTapEditor, { type TipTapEditorRef } from '@/components/editor/tiptap-editor';
import { Input } from '@/components/input/input';
import { usePostAdminNotice } from '@/hooks/api/use-post-admin-notice';
import { revalidateNotice } from '@/lib/actions/revalidateNotice';

const baseStyle = 'rounded-full px-5 py-1 pt-1.5 text-center font-bold text-[14px]';

const activeStyle = 'bg-slate-800 text-white border border-white';

const nonActiveStyle = 'bg-white text-black border border-slate-400';

export default function WriteNotice() {
  const router = useRouter();
  const [selectedTag, isSelectedTag] = useState(2);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<TipTapEditorRef>(null);

  const { mutate: postAdminNotice } = usePostAdminNotice();

  const handleSubmit = () => {
    const title = titleRef.current?.value;
    const content = contentRef.current?.getHTML();
    if (!title || !content) {
      alert('제목, 내용을 입력해주세요');
      return;
    }
    postAdminNotice(
      { title, content, categoryId: selectedTag },
      {
        onSuccess: async () => {
          await revalidateNotice();
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
      <Input ref={titleRef} placeholder="제목" />

      <TipTapEditor
        ref={contentRef}
        placeholder="내용을 입력해주세요."
        className="w-full max-w-4xl"
      />
      <button
        onClick={handleSubmit}
        className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-950"
      >
        작성하기
      </button>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { usePatchAdminNotice } from '@/domains/notice/hooks/use-patch-admin-notice';
import type { DetailNoticeResponse } from '@/domains/notice/types/notice';
import TipTapEditor, { type TipTapEditorRef } from '@/shared/components/ui/editor/tiptap-editor';
import { Input } from '@/shared/components/ui/input/input';
import { revalidateNotice } from '@/shared/lib/actions/revalidateNotice';

const baseStyle = 'rounded-full px-5 py-1 pt-1.5 text-center font-bold text-[14px]';
const activeStyle = 'bg-slate-800 text-white border border-white';
const nonActiveStyle = 'bg-white text-black border border-slate-400';

interface EditNoticeProps {
  notice: DetailNoticeResponse;
}

const CATEGORY_MAP: Record<string, number> = { 공지: 2, 이벤트: 3 };

export default function EditNotice({ notice }: EditNoticeProps) {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState(CATEGORY_MAP[notice.category]);

  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<TipTapEditorRef>(null);

  const { mutate: putAdminNotice } = usePatchAdminNotice();

  const handleSubmit = () => {
    const title = titleRef.current?.value;
    const content = editorRef.current?.getHTML();

    if (!title?.trim() || !content?.replace(/<[^>]*>/g, '').trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    putAdminNotice(
      {
        id: notice.noticeId,
        title,
        content,
        categoryId: selectedTag,
      },
      {
        onSuccess: async () => {
          await revalidateNotice(notice.noticeId);
          router.push(`/notice/${notice.noticeId}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <h1 className="text-2xl font-bold">공지사항 수정</h1>

      <div className="flex gap-4">
        <button
          onClick={() => setSelectedTag(2)}
          className={`${baseStyle} ${selectedTag === 2 ? activeStyle : nonActiveStyle}`}
        >
          공지
        </button>
        <button
          onClick={() => setSelectedTag(3)}
          className={`${baseStyle} ${selectedTag === 3 ? activeStyle : nonActiveStyle}`}
        >
          이벤트
        </button>
      </div>

      <Input
        ref={titleRef}
        defaultValue={notice?.title || ''}
        placeholder="제목"
        className="w-full max-w-4xl"
      />

      <TipTapEditor
        ref={editorRef}
        initialContent={notice?.content || ''}
        placeholder="내용을 입력해주세요."
        className="w-full max-w-4xl"
      />

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-950"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { usePostAdminNotice } from '@/domains/notice/apis/mutations/use-post-admin-notice';
import { useNoticeFileKeys } from '@/domains/notice/hooks/use-notice-file-keys';
import type { NoticeCategoryType } from '@/domains/notice/types/notice';
import TipTapEditor, { type TipTapEditorRef } from '@/shared/components/ui/editor/tiptap-editor';
import { Input } from '@/shared/components/ui/input/input';
import { revalidateNotice } from '@/shared/lib/actions/revalidateNotice';

export default function WriteNotice() {
  const router = useRouter();
  const [selectedTag, isSelectedTag] = useState<NoticeCategoryType>('announcement');

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<TipTapEditorRef>(null);

  const { mutate: postAdminNotice, isPending } = usePostAdminNotice();

  const { handleImageUpload, extractUsedFileKeys, convertTmpUrlsToFileUrls } = useNoticeFileKeys();

  const handleSubmit = () => {
    const title = titleRef.current?.value;
    const rawContent = contentRef.current?.getHTML();

    if (!title?.trim() || !rawContent?.replace(/<[^>]*>/g, '').trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const convertedContent = convertTmpUrlsToFileUrls(rawContent);

    const fileKeys = extractUsedFileKeys(rawContent);

    postAdminNotice(
      {
        title,
        content: convertedContent,
        category: selectedTag,
        fileKeys,
      },
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
          onClick={() => isSelectedTag('announcement')}
          className={`rounded-full px-5 py-1 pt-1.5 text-center text-[14px] font-bold ${
            selectedTag === 'announcement'
              ? 'border border-white bg-slate-800 text-white'
              : 'border border-slate-400 bg-white text-black'
          }`}
        >
          공지
        </button>
        <button
          onClick={() => isSelectedTag('event')}
          className={`rounded-full px-5 py-1 pt-1.5 text-center text-[14px] font-bold ${
            selectedTag === 'event'
              ? 'border border-white bg-slate-800 text-white'
              : 'border border-slate-400 bg-white text-black'
          }`}
        >
          이벤트
        </button>
      </div>

      <Input ref={titleRef} placeholder="제목" />

      <TipTapEditor
        ref={contentRef}
        placeholder="내용을 입력해주세요."
        className="w-full max-w-4xl"
        onImageUpload={handleImageUpload}
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className={`rounded-md px-4 py-2 text-white transition-colors ${
          isPending ? 'cursor-not-allowed bg-slate-400' : 'bg-slate-800 hover:bg-slate-950'
        }`}
      >
        {isPending ? '작성 중...' : '작성하기'}
      </button>
    </div>
  );
}

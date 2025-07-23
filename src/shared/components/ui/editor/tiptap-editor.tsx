'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextStyle from '@tiptap/extension-text-style';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export interface TipTapEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  getHTML: () => string;
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    onClick={onClick}
    className={`rounded p-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
    } border border-slate-300`}
    title={title}
    type="button"
  >
    {children}
  </button>
);

interface TipTapEditorProps {
  placeholder?: string;
  className?: string;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(
  (
    { placeholder = '내용을 입력해주세요.', className = '', initialContent = '', onContentChange },
    ref,
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
      extensions: [
        StarterKit,
        Image.configure({
          HTMLAttributes: {
            class:
              'max-w-full h-auto rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-300 transition-colors',
          },
          allowBase64: true,
        }),
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: 'border-collapse border border-slate-400 w-full',
          },
        }),
        TableRow,
        TableHeader.configure({
          HTMLAttributes: {
            class: 'border border-slate-400 bg-slate-100 p-2 font-semibold',
          },
        }),
        TableCell.configure({
          HTMLAttributes: {
            class: 'border border-slate-400 p-2',
          },
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-600 hover:text-blue-800 underline',
          },
        }),
        Highlight.configure({
          HTMLAttributes: {
            class: 'bg-yellow-200 px-1 rounded',
          },
        }),
        TextStyle,
        Color,
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
        },
      },
      onUpdate: ({ editor }) => {
        if (onContentChange) {
          onContentChange(editor.getHTML());
        }
      },
      immediatelyRender: false,
    });

    useImperativeHandle(ref, () => ({
      getContent: () => editor?.getHTML() || '',
      setContent: (content: string) => editor?.commands.setContent(content),
      getHTML: () => editor?.getHTML() || '',
    }));

    useEffect(() => {
      if (editor && initialContent && editor.getHTML() !== initialContent) {
        editor.commands.setContent(initialContent);
      }
    }, [editor, initialContent]);

    const handleImageUpload = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('이미지 크기는 5MB를 초과할 수 없습니다.');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          editor?.commands.setImage({ src });
        };
        reader.readAsDataURL(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const addLink = () => {
      const url = window.prompt('링크 URL을 입력하세요:');
      if (url) {
        editor?.chain().focus().setLink({ href: url }).run();
      }
    };

    const removeLink = () => {
      editor?.chain().focus().unsetLink().run();
    };

    const insertTable = () => {
      editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const deleteSelectedContent = () => {
      if (editor) {
        const { selection } = editor.state;
        const { from, to } = selection;

        if (from !== to) {
          editor.commands.deleteSelection();
        } else {
          const node = editor.state.doc.nodeAt(from);
          if (node && node.type.name === 'image') {
            editor.commands.deleteNode('image');
          } else {
            editor.commands.deleteSelection();
          }
        }
      }
    };

    if (!editor) {
      return (
        <div
          className={`flex h-80 items-center justify-center rounded-md border border-slate-300 bg-slate-50 ${className}`}
        >
          <div className="text-slate-500">에디터 로딩 중...</div>
        </div>
      );
    }

    return (
      <div className={`rounded-md border border-slate-300 ${className}`}>
        <div className="flex flex-wrap gap-1 border-b border-slate-300 bg-slate-50 p-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="굵게"
          >
            <strong>B</strong>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="기울임"
          >
            <em>I</em>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="하이라이트"
          >
            <span className="rounded bg-yellow-200 px-1">H</span>
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-slate-300" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="순서없는 목록"
          >
            ⋅
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="순서있는 목록"
          >
            1.
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-slate-300" />

          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="링크 추가">
            🔗
          </ToolbarButton>

          <ToolbarButton onClick={removeLink} title="링크 제거">
            🔗❌
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-slate-300" />

          <ToolbarButton onClick={handleImageUpload} title="이미지 업로드">
            🖼️
          </ToolbarButton>

          <ToolbarButton onClick={deleteSelectedContent} title="선택된 내용 삭제">
            🗑️
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-slate-300" />

          <ToolbarButton onClick={insertTable} title="표 삽입">
            ⊞
          </ToolbarButton>
        </div>

        <div className="min-h-[300px]">
          <EditorContent editor={editor} className="h-full" placeholder={placeholder} />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  },
);

TipTapEditor.displayName = 'TipTapEditor';

export default TipTapEditor;

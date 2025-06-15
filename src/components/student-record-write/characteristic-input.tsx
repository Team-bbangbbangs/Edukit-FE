import { useState, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { Textarea } from '@/components/textarea/textarea';
import { usePostPrompt } from '@/hooks/api/use-post-prompt';
import type { StudentNameTypes } from '@/types/api/student-record';

interface CharacteristicInputProps {
  students: StudentNameTypes[];
  selectedId: number;
}

export default function CharacteristicInput({ students, selectedId }: CharacteristicInputProps) {
  const { mutate: postPrompt } = usePostPrompt();
  const characteristicInputTextRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const selectedStudentName = students.find(
    (student) => student.recordId === selectedId,
  )?.studentName;

  const [open, setOpen] = useState(false);

  const handleButtonClick = () => {
    const value = characteristicInputTextRef.current?.value;
    if (!value) {
      alert('작성해주세요.');
      return;
    }
    postPrompt({ recordId: selectedId, description: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-[24px] font-bold">학생 특성 기입란</h2>
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex gap-2 rounded-md bg-slate-800 px-6 pb-1.5 pt-2 text-white hover:bg-slate-950"
          >
            <span>{selectedStudentName}</span>
            <span>▼</span>
          </button>
          {open ? (
            <div className="absolute top-8 flex max-h-40 w-full flex-col overflow-y-scroll rounded-b-md">
              {students.map((student) => (
                <button
                  key={student.recordId}
                  onClick={() => {
                    router.push(`?recordId=${student.recordId}`);
                    setOpen(false);
                  }}
                  disabled={selectedId === student.recordId}
                  className={`px-2 py-1 text-white ${selectedId === student.recordId ? 'bg-slate-950' : 'bg-slate-600 hover:bg-slate-800'} `}
                >
                  {student.studentName}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <Textarea
        ref={characteristicInputTextRef}
        placeholder="내용을 입력해주세요."
        className="h-60 border-slate-400 p-5 placeholder:text-slate-400"
      />
      <div className="flex justify-end">
        <button
          onClick={handleButtonClick}
          className="w-auto rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white hover:bg-slate-950"
        >
          생성
        </button>
      </div>
    </div>
  );
}

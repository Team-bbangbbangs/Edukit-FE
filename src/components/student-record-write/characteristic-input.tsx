import { useState, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { Textarea } from '@/components/textarea/textarea';
import { usePostPrompt } from '@/hooks/api/use-post-prompt';
import { trackEvent } from '@/lib/amplitude/amplitude';
import type { StudentNameTypes, AiResponseData, RecordType } from '@/types/api/student-record';
import { calculateByte } from '@/util/calculate-byte';
import { getKoreaFormattedTimeStamp } from '@/util/get-korea-formatted-time-stamp';

interface CharacteristicInputProps {
  students: StudentNameTypes[];
  selectedId: number;
  recordType: RecordType;
  onGenerationStart: () => void;
  onResponseGenerated: (data: AiResponseData) => void;
}

export default function CharacteristicInput({
  students,
  selectedId,
  recordType,
  onGenerationStart,
  onResponseGenerated,
}: CharacteristicInputProps) {
  const { mutate: postPrompt, isPending } = usePostPrompt();
  const characteristicInputTextRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const selectedStudentName = students.find(
    (student) => student.recordId === selectedId,
  )?.studentName;

  const [open, setOpen] = useState(false);

  const handleButtonClick = () => {
    const value = characteristicInputTextRef.current?.value;
    if (!value) {
      alert('내용을 입력해주세요.');
      return;
    }

    trackEvent('AI 기능 사용', {
      recordType: recordType,
      inputLength: calculateByte(value),
      timestamp: getKoreaFormattedTimeStamp(),
    });

    onGenerationStart();
    postPrompt(
      { recordId: selectedId, prompt: value },
      {
        onSuccess: (data) => {
          onResponseGenerated(data);
        },
        onError: () => {
          alert('생성에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-[24px] font-bold">학생 특성 기입란</h2>
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="relative z-10 flex gap-1 rounded-md bg-slate-800 px-3 pb-1.5 pt-2 text-white hover:bg-slate-950"
          >
            <span className="w-14 overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedStudentName}
            </span>
            <span>▼</span>
          </button>
          {open ? (
            <div className="absolute top-8 flex max-h-[168px] w-full flex-col overflow-y-scroll rounded-b-md">
              {students.map((student, index) => (
                <button
                  key={student.recordId}
                  onClick={() => {
                    router.push(`?recordId=${student.recordId}`);
                    setOpen(false);
                  }}
                  disabled={selectedId === student.recordId}
                  className={`flex w-full items-center px-2 py-1 text-white ${selectedId === student.recordId ? 'bg-slate-950' : 'bg-slate-600 hover:bg-slate-800'} ${index === 0 ? 'min-h-10 pt-2' : 'min-h-8'} ${index === students.length - 1 ? 'rounded-b-md' : null}`}
                >
                  <span className="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {student.studentName}
                  </span>
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
          disabled={isPending}
          className="w-auto rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white hover:bg-slate-950 disabled:bg-slate-400"
        >
          {isPending ? '생성중...' : '생성'}
        </button>
      </div>
    </div>
  );
}

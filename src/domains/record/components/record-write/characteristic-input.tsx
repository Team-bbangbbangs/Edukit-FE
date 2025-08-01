import { useRouter } from 'next/navigation';

import { usePostPrompt } from '@/domains/record/apis/mutations/use-post-prompt';
import type { StudentNames, PromptResponse } from '@/domains/record/types/record';
import Dropdown from '@/shared/components/ui/dropdown/dropdown';
import { Textarea } from '@/shared/components/ui/textarea/textarea';
import { useAutoResizeTextarea } from '@/shared/hooks/use-auto-resize-textarea';

interface CharacteristicInputProps {
  students: StudentNames[];
  selectedId: number;
  onGenerationStart: () => void;
  onResponseGenerated: (data: PromptResponse) => void;
}

export default function CharacteristicInput({
  students,
  selectedId,
  onGenerationStart,
  onResponseGenerated,
}: CharacteristicInputProps) {
  const { mutate: postPrompt, isPending } = usePostPrompt();
  const { textareaRef: characteristicInputTextRef, resizeTextarea } = useAutoResizeTextarea(
    '',
    240,
  );
  const router = useRouter();

  const selectedStudentName = students.find(
    (student) => student.recordId === selectedId,
  )?.studentName;

  const handleButtonClick = () => {
    const value = characteristicInputTextRef.current?.value;
    if (!value) {
      alert('내용을 입력해주세요.');
      return;
    }

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

  const handleStudentSelect = (recordId: number) => {
    router.push(`?recordId=${recordId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-[24px] font-bold">학생 특성 기입란</h2>
        <Dropdown>
          <Dropdown.Trigger
            iconPosition="right"
            className="w-full gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedStudentName}
          </Dropdown.Trigger>

          <Dropdown.Content>
            {students.map((student, index) => {
              const isSelected = selectedId === student.recordId;
              return (
                <Dropdown.Item
                  key={student.recordId}
                  index={index}
                  onClick={() => handleStudentSelect(student.recordId)}
                  selected={isSelected}
                  className="flex justify-center"
                >
                  {student.studentName}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Content>
        </Dropdown>
      </div>

      <Textarea
        ref={characteristicInputTextRef}
        placeholder="내용을 입력해주세요. (학생의 활동 내용이나 특성을 작성해주시면 생활기록부 지침에 맞게 작성해드립니다)"
        className="min-h-60 resize-none border-slate-400 p-5 placeholder:text-slate-400"
        style={{
          lineHeight: 'inherit',
          fontSize: 'inherit',
          overflow: 'hidden',
        }}
        onInput={resizeTextarea}
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

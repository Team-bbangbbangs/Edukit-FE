import { useState } from 'react';

import { useAiGenerate } from '@/domains/record/apis/mutations/use-ai-generate';
import { calculateByte } from '@/domains/record/utils/calculate-byte';
import Button from '@/shared/components/ui/button/button';
import { useAutoResizeTextarea } from '@/shared/hooks/use-auto-resize-textarea';

interface CharacteristicInputProps {
  selectedId?: number;
  bytesLimit: number;
  onBytesLimitChange: (newLimit: number) => void;
  onGenerationStart: () => void;
  onTaskIdReceived: (taskId: string) => void;
}

export default function CharacteristicInput({
  selectedId,
  bytesLimit,
  onBytesLimitChange,
  onGenerationStart,
  onTaskIdReceived,
}: CharacteristicInputProps) {
  const [description, setDescription] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: aiGenerate, isPending } = useAiGenerate();
  const { textareaRef: characteristicInputTextRef, resizeTextarea } = useAutoResizeTextarea(
    description,
    150,
  );

  const isValidSelectedId = selectedId && !isNaN(selectedId);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleBytesLimitEdit = () => {
    if (isValidSelectedId) {
      setIsEditing(true);
      setShowTooltip(false);
    }
  };

  const handleBytesLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      onBytesLimitChange(bytesLimit);
      return;
    }

    if (!/^\d+$/.test(inputValue)) {
      return;
    }

    const newValue = Number(inputValue);

    if (isNaN(newValue)) {
      return;
    }

    if (newValue < 0) {
      return;
    }

    onBytesLimitChange(newValue);
  };

  const handleBytesLimitBlur = () => {
    setIsEditing(false);
  };

  const handleTooltipClick = () => {
    setShowTooltip(false);
  };

  const handleButtonClick = () => {
    if (!isValidSelectedId) {
      alert('학생을 먼저 선택해주세요.');
      return;
    }

    if (!description.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    onGenerationStart();
    aiGenerate(
      {
        recordId: selectedId,
        request: {
          byteCount: calculateByte(description),
          prompt: description,
        },
      },
      {
        onSuccess: (data) => {
          onTaskIdReceived(data.taskId);
        },
        onError: () => {
          alert('생성에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <h4 className="text-title-20 text-gray-black">학생 특성 기입란</h4>
      <div className="flex flex-col gap-3 rounded-[20px] border border-gray-2 p-6">
        <textarea
          ref={characteristicInputTextRef}
          value={description}
          onChange={handleDescriptionChange}
          onInput={resizeTextarea}
          disabled={!isValidSelectedId}
          placeholder={
            isValidSelectedId
              ? '내용을 입력해주세요. (학생의 활동 내용이나 특성을 작성해주시면 생활기록부 지침에 맞게 작성해드립니다)'
              : '학생 선택 후 작성 가능합니다.'
          }
          className="resize-none border-none bg-transparent p-0 text-body-18-m text-gray-black outline-none placeholder:text-body-18-m placeholder:text-gray-4"
        />
        <div className="flex flex-col items-end justify-center self-stretch">
          <Button
            color="primary"
            variant="fill"
            size="medium"
            shape="pill"
            disabled={isPending || !isValidSelectedId}
            onClick={handleButtonClick}
          >
            {isPending ? '생성중...' : '생성'}
          </Button>
        </div>
      </div>
      <div className="relative flex items-center justify-end self-stretch">
        <div className="flex items-start gap-[2px]">
          <span
            className={`text-body-16-r ${bytesLimit < calculateByte(description) ? 'text-brandRed' : 'text-gray-4'}`}
          >
            {calculateByte(description)}
          </span>
          <span className="text-body-16-r text-gray-4">/</span>
          {isEditing ? (
            <input
              value={bytesLimit}
              onChange={handleBytesLimitChange}
              onBlur={handleBytesLimitBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleBytesLimitBlur();
                }
                if (e.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              autoFocus
              className="m-0 appearance-none border-none bg-transparent p-0 text-center text-body-16-r text-gray-4 outline-none"
              style={{
                width: `${String(bytesLimit).length * 0.6}em`,
              }}
            />
          ) : (
            <button
              onClick={handleBytesLimitEdit}
              className={`border-none bg-transparent text-body-16-r text-gray-4 ${
                isValidSelectedId
                  ? 'hover:text-gray-6 cursor-pointer underline decoration-1 underline-offset-2'
                  : 'cursor-not-allowed'
              }`}
            >
              {bytesLimit}
            </button>
          )}
          <span className="text-body-16-r text-gray-4">Bytes</span>
        </div>
        {showTooltip && isValidSelectedId ? (
          <div className="absolute right-0 top-8 cursor-pointer" onClick={handleTooltipClick}>
            <div className="absolute -top-2 right-[52px] h-0 w-0 border-b-[8px] border-l-[8px] border-r-[8px] border-b-[#464646] border-l-transparent border-r-transparent" />
            <div className="whitespace-nowrap rounded-[10px] bg-[#464646] p-3 text-label-12 text-gray-1">
              생성 글자수 변경하기
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

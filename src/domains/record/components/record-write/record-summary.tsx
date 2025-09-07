import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { usePostRecordDetail } from '@/domains/record/apis/mutations/use-post-record-detail';
import { useGetRecordDetail } from '@/domains/record/apis/queries/use-get-record-detail';
import SaveSummaryRecordModal from '@/domains/record/components/record-write/save-summary-record-modal';
import type { RecordType } from '@/domains/record/types/record';
import { calculateByte } from '@/domains/record/utils/calculate-byte';
import Button from '@/shared/components/ui/button/button';
import Loading from '@/shared/components/ui/loading/loading';
import { useAutoResizeTextarea } from '@/shared/hooks/use-auto-resize-textarea';

interface RecordSummaryProps {
  selectedId: number;
  recordType: RecordType;
  bytesLimit: number;
}

export default function RecordSummary({ selectedId, recordType, bytesLimit }: RecordSummaryProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const { mutate: postRecordDetail } = usePostRecordDetail();
  const { data, isPending, isError } = useGetRecordDetail(selectedId);
  const { textareaRef, resizeTextarea } = useAutoResizeTextarea(description, 150);

  useEffect(() => {
    if (data) {
      setDescription(data.description || '');
    }
  }, [data]);

  const handleSave = () => {
    postRecordDetail(
      {
        recordId: selectedId,
        description,
      },
      {
        onSuccess: () => {
          setModalOpen(true);
        },
        onError: (error) => {
          alert(error.message);
        },
      },
    );
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  if (isError) {
    router.push(`/write-${recordType}`);
  }
  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h4 className="text-title-20 text-gray-black">최종</h4>
      <div className="flex flex-col gap-3 rounded-[20px] border border-gray-2 p-6">
        <textarea
          data-testid="summary-input"
          ref={textareaRef}
          value={description}
          onChange={handleDescriptionChange}
          onInput={resizeTextarea}
          placeholder="완성본을 적어주세요."
          className="resize-none border-none bg-transparent p-0 text-body-18-m text-gray-black outline-none placeholder:text-body-18-m placeholder:text-gray-4"
        />
        <div className="flex flex-col items-end justify-center self-stretch">
          <Button
            color="primary"
            variant="fill"
            size="medium"
            shape="pill"
            disabled={!description.trim()}
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-end self-stretch">
        <div className="flex items-start gap-[2px]">
          <span
            className={`text-body-16-r ${bytesLimit < calculateByte(description) ? 'text-brandRed' : 'text-gray-4'}`}
          >
            {calculateByte(description)}
          </span>
          <span className="text-body-16-r text-gray-4">/</span>
          <span className="text-body-16-r text-gray-4">{bytesLimit}</span>
          <span className="text-body-16-r text-gray-4">Bytes</span>
        </div>
      </div>

      <SaveSummaryRecordModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

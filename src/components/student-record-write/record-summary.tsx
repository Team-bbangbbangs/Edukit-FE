import { useState, useEffect } from 'react';

import DefaultError from '@/components/error/default-error';
import Loading from '@/components/loading/loading';
import SaveSummaryRecordModal from '@/components/modal/save-summary-record-modal';
import { Textarea } from '@/components/textarea/textarea';
import { useGetSummaryRecordDetail } from '@/hooks/api/use-get-summary-record-detail';
import { usePostSummaryRecordDetail } from '@/hooks/api/use-post-summary-record-detail';
import { calculateByte } from '@/util/calculate-byte';

export default function RecordSummary({ selectedId }: { selectedId: number }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const { mutate: postSummaryRecordDetail } = usePostSummaryRecordDetail();
  const { data, isPending, isError } = useGetSummaryRecordDetail(selectedId);

  useEffect(() => {
    if (data?.description) {
      setDescription(data.description);
    }
  }, [data?.description]);

  const handleSave = () => {
    const byteCount = calculateByte(description);

    postSummaryRecordDetail(
      {
        recordId: selectedId,
        description,
        byteCount,
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

  if (isError) {
    return <DefaultError />;
  }
  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="relative flex flex-col gap-4">
      <h4 className="font-bold">종합</h4>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="완성본을 적어주세요."
        className="h-60 border-slate-400 p-5 placeholder:text-slate-400"
      />
      <div className="flex justify-end">
        <button
          disabled={!description.trim()}
          className={`rounded-md px-4 pb-1.5 pt-2 text-white ${
            !description.trim()
              ? 'cursor-not-allowed bg-slate-400'
              : 'bg-slate-800 hover:bg-slate-950'
          }`}
          onClick={handleSave}
        >
          저장
        </button>
      </div>
      <span className="absolute bottom-14 right-2 text-slate-400">{`${calculateByte(description)}/1500`}</span>
      <SaveSummaryRecordModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

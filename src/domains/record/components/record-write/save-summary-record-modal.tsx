'use client';

import { Save } from 'lucide-react';

import Modal from '@/shared/components/ui/modal/modal';

interface SaveSummaryRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SaveSummaryRecordModal({
  open,
  onOpenChange,
}: SaveSummaryRecordModalProps) {
  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Overlay />
      <Modal.Content aria-describedby={undefined} className="max-w-md rounded-xl px-8 py-6">
        <Modal.Close />
        <Modal.Title className="flex flex-col items-center justify-center gap-4 text-[20px]">
          <Save className="h-8 w-8" />
          <span className="text-gray-800">성공적으로 저장되었습니다</span>
        </Modal.Title>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleConfirm}
            className="rounded-md bg-slate-800 px-6 py-2 font-bold text-white transition-colors hover:bg-slate-950"
          >
            확인
          </button>
        </div>
      </Modal.Content>
    </Modal>
  );
}

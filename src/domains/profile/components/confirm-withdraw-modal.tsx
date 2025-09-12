'use client';

import { TriangleAlert } from 'lucide-react';

import Modal from '@/shared/components/ui/modal/modal';

interface ConfirmWithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ConfirmWithdrawModal({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmWithdrawModalProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Overlay />
      <Modal.Content aria-describedby={undefined} className="max-w-xl rounded-xl px-8 py-6">
        <Modal.Close />
        <Modal.Title className="flex flex-col items-center justify-center gap-4 text-[20px]">
          <div className="flex h-16 w-16 items-center justify-center">
            <TriangleAlert className="h-8 w-8 text-red-600" />
          </div>
          <span className="text-gray-800">정말 탈퇴하시겠어요?</span>
        </Modal.Title>
        <Modal.Description className="font-bold !text-black">
          탈퇴 시 모든 계정 정보와 데이터가 삭제되며, 복구가 불가능합니다.
        </Modal.Description>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="rounded-md bg-slate-800 px-6 py-2 font-bold text-white transition-colors hover:bg-slate-950"
          >
            취소
          </button>
          <button
            data-testid="modal-remove-button"
            onClick={onConfirm}
            className="rounded-md bg-red-700 px-6 py-2 font-bold text-white hover:bg-red-600"
          >
            탈퇴하기
          </button>
        </div>
      </Modal.Content>
    </Modal>
  );
}

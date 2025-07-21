'use client';

import { TriangleAlert } from 'lucide-react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalOverlay,
  ModalPortal,
} from './base-modal';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  onDelete,
}: DeleteConfirmModalProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent aria-describedby={undefined} className="max-w-md rounded-xl px-8 py-6">
          <ModalHeader className="w-full">
            <ModalTitle className="flex flex-col items-center justify-center gap-4 text-[20px]">
              <div className="flex h-16 w-16 items-center justify-center">
                <TriangleAlert className="h-8 w-8 text-red-600" />
              </div>
              <span className="text-gray-800">정말 삭제하시겠습니까?</span>
            </ModalTitle>
          </ModalHeader>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleCancel}
              className="rounded-md bg-slate-800 px-6 py-2 font-bold text-white transition-colors hover:bg-slate-950"
            >
              취소
            </button>
            <button
              data-testid="modal-remove-button"
              onClick={onDelete}
              className="rounded-md bg-red-700 px-6 py-2 font-bold text-white hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}

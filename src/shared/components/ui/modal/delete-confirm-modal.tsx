'use client';

import Button from '@/shared/components/ui/button/button';

import Modal from './modal';

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
      <Modal.Overlay />
      <Modal.Content aria-describedby={undefined} className="max-w-[787px] rounded-[20px] p-14">
        <Modal.Close />
        <Modal.Title className="mb-4 text-title-20 text-gray-black">
          정말 삭제하시겠습니까?
        </Modal.Title>
        <Modal.Description className="mb-10 text-title-18 text-gray-5">
          현재까지 작성한 학생들의 생활기록부 내용이 사라집니다.
        </Modal.Description>

        <div className="flex items-start gap-6 self-stretch">
          <Button
            color="secondary"
            variant="stroke"
            size="large"
            shape="rect"
            className="flex flex-1 items-center justify-center"
            onClick={handleCancel}
          >
            <span className="text-label-18 text-gray-4">취소</span>
          </Button>
          <Button
            className="flex flex-1 items-center justify-center bg-brandRed hover:bg-red-600"
            variant="stroke"
            size="large"
            shape="rect"
            onClick={onDelete}
            data-testid="modal-remove-button"
          >
            <span className="text-label-18 text-white">삭제</span>
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}

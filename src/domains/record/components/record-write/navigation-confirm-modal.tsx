import Button from '@/shared/components/ui/button/button';
import Modal from '@/shared/components/ui/modal/modal';

interface NavigationConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NavigationConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: NavigationConfirmModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Modal.Overlay />
      <Modal.Content aria-describedby={undefined} className="max-w-[787px] rounded-[20px] p-14">
        <Modal.Close />
        <Modal.Title className="mb-4 text-title-20 text-gray-black">
          페이지를 이동하시겠습니까?
        </Modal.Title>
        <Modal.Description className="mb-10 text-title-18 text-gray-5">
          현재 AI 응답을 생성 중입니다. 페이지를 이동하면 진행 중인 작업이 중단됩니다.
        </Modal.Description>

        <div className="flex items-start gap-6 self-stretch">
          <Button
            color="secondary"
            variant="stroke"
            size="large"
            shape="rect"
            className="flex flex-1 items-center justify-center"
            onClick={onCancel}
          >
            <span className="text-label-18 text-gray-4">취소</span>
          </Button>
          <Button
            className="flex flex-1 items-center justify-center"
            variant="fill"
            size="large"
            shape="rect"
            color="secondary"
            onClick={onConfirm}
          >
            <span className="text-label-18 text-white">이동</span>
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}

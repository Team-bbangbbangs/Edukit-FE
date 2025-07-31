import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

/* -------------------------------------------------------------------------------------------------
 * ModalTypes
 * -----------------------------------------------------------------------------------------------*/

interface ModalContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ModalComponentProps {
  children: ReactNode;
  className?: string;
}

/* -------------------------------------------------------------------------------------------------
 * Modal Context
 * -----------------------------------------------------------------------------------------------*/

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext는 ModalContext.Provider내부에 선언되어야 합니다.');
  }
  return context;
};

/* -------------------------------------------------------------------------------------------------
 * Root Modal
 * -----------------------------------------------------------------------------------------------*/

function Modal({ children, open, onOpenChange }: ModalProps) {
  const [isMounted, setIsMounted] = useState(open);
  const [renderOpen, setRenderOpen] = useState(open);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      requestAnimationFrame(() => {
        setRenderOpen(true);
      });
    } else {
      setRenderOpen(false);

      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!isMounted) return null;

  const contextValue: ModalContextValue = {
    open: renderOpen,
    onOpenChange,
  };

  return createPortal(
    <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>,
    document.body,
  );
}

Modal.displayName = 'Modal';

/* -------------------------------------------------------------------------------------------------
 * Modal Overlay
 * -----------------------------------------------------------------------------------------------*/

function ModalOverlay({ className = '' }: { className?: string }) {
  const { open, onOpenChange } = useModalContext();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/50 duration-200 ${
        open ? 'animate-in fade-in-0' : 'invisible animate-out fade-out-0'
      } ${className} `}
      onClick={handleClick}
      aria-hidden="true"
    />
  );
}

ModalOverlay.displayName = 'ModalOverlay';

/* -------------------------------------------------------------------------------------------------
 * Modal Content
 * -----------------------------------------------------------------------------------------------*/

function ModalContent({ children, className = '' }: ModalComponentProps) {
  const { open } = useModalContext();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed left-1/2 top-1/2 z-50 flex w-full translate-x-[-50%] translate-y-[-50%] flex-col items-center gap-4 border bg-background p-12 shadow-lg duration-200 sm:rounded-lg ${
        open
          ? 'animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]'
          : 'invisible animate-out fade-out-0 zoom-out-95 slide-out-to-left-1/2 slide-out-to-top-[48%]'
      } ${className} `}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

ModalContent.displayName = 'ModalContent';

/* -------------------------------------------------------------------------------------------------
 * Modal Close
 * -----------------------------------------------------------------------------------------------*/

function ModalClose() {
  const { onOpenChange } = useModalContext();

  const handleClick = () => {
    onOpenChange(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute right-6 top-6 duration-200 hover:scale-125"
      aria-label="닫기"
    >
      <X className="h-6 w-6" />
    </button>
  );
}

ModalClose.displayName = 'ModalClose';

/* -------------------------------------------------------------------------------------------------
 * Modal Title
 * -----------------------------------------------------------------------------------------------*/

function ModalTitle({ children, className = '' }: ModalComponentProps) {
  return (
    <h2 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

ModalTitle.displayName = 'ModalTitle';

/* -------------------------------------------------------------------------------------------------
 * Modal Description
 * -----------------------------------------------------------------------------------------------*/

function ModalDescription({ children, className = '' }: ModalComponentProps) {
  return <p className={`text-lg text-muted-foreground ${className}`}>{children}</p>;
}

ModalDescription.displayName = 'ModalDescription';

/* -------------------------------------------------------------------------------------------------
 * export Modal
 * -----------------------------------------------------------------------------------------------*/

Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Close = ModalClose;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;

export default Modal;

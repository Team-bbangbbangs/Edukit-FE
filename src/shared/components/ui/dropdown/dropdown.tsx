import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

import { ChevronDown } from 'lucide-react';

import { useKeyboardNavigation } from '@/shared/hooks/use-keyboard-navigation';

/* -------------------------------------------------------------------------------------------------
 * Dropdown Types
 * -----------------------------------------------------------------------------------------------*/

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  itemCount: number;
  setItemCount: (count: number) => void;
}

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

interface DropdownContentProps extends DropdownProps {
  itemCount?: number;
}

interface RootDropdownProps extends DropdownProps {
  defaultOpen?: boolean;
  initialFocusIndex?: number;
}

interface DropdownTriggerProps extends DropdownProps {
  iconPosition?: 'left' | 'right' | 'none';
  iconSize?: number;
  iconClassName?: string;
  onClick?: () => void;
}

interface DropdownItemProps extends DropdownProps {
  onClick?: () => void;
  selected?: boolean;
  index?: number;
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Context
 * -----------------------------------------------------------------------------------------------*/

const DropdownContext = createContext<DropdownContextValue | null>(null);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext는 DropdownContext.Provider내부에 선언되어야 합니다.');
  }
  return context;
};

/* -------------------------------------------------------------------------------------------------
 * Root Dropdown
 * -----------------------------------------------------------------------------------------------*/

function Dropdown({
  children,
  defaultOpen = false,
  className = '',
  initialFocusIndex = -1,
}: RootDropdownProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [itemCount, setItemCount] = useState(0);

  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    isOpen: open,
    itemCount,
    initialIndex: initialFocusIndex,
    onSelect: (index) => {
      const items = document.querySelectorAll('[data-dropdown-item]');
      const targetItem = items[index] as HTMLButtonElement;
      if (targetItem) {
        targetItem.click();
      }
    },
    onEscape: () => setOpen(false),
  });

  const contextValue: DropdownContextValue = {
    open,
    setOpen,
    focusedIndex,
    setFocusedIndex,
    itemCount,
    setItemCount,
  };

  return (
    <DropdownContext.Provider value={contextValue}>
      <div className={`relative ${className}`}>
        <Dropdown.Overlay />
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

Dropdown.displayName = 'Dropdown';

/* -------------------------------------------------------------------------------------------------
 * Dropdown Overlay
 * -----------------------------------------------------------------------------------------------*/

function DropdownOverlay() {
  const { open, setOpen } = useDropdownContext();

  if (!open) return null;

  return <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setOpen(false)} />;
}

DropdownOverlay.displayName = 'DropdownOverlay';

/* -------------------------------------------------------------------------------------------------
 * Dropdown Trigger
 * -----------------------------------------------------------------------------------------------*/

function DropdownTrigger({
  children,
  className = '',
  iconPosition = 'none',
  onClick,
}: DropdownTriggerProps) {
  const { open, setOpen } = useDropdownContext();

  const handleClick = (e: React.MouseEvent) => {
    onClick?.();
    e.stopPropagation();
    setOpen(!open);
  };

  const Icon =
    iconPosition !== 'none' ? (
      <ChevronDown className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} `} />
    ) : null;

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white p-2 hover:border-gray-400 ${className}`}
      aria-expanded={open}
      aria-haspopup="menu"
      data-state={open ? 'open' : 'closed'}
      onClick={handleClick}
    >
      {iconPosition === 'left' ? Icon : null}
      {children}
      {iconPosition === 'right' ? Icon : null}
    </button>
  );
}

DropdownTrigger.displayName = 'DropdownTrigger';

/* -------------------------------------------------------------------------------------------------
 * Dropdown Content
 * -----------------------------------------------------------------------------------------------*/

function DropdownContent({ children, className = '', itemCount }: DropdownContentProps) {
  const { open, setItemCount } = useDropdownContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [renderOpen, setRenderOpen] = useState(false);

  const calculatedItemCount = itemCount ?? React.Children.count(children);

  useEffect(() => {
    if (open) {
      setItemCount(calculatedItemCount);
    } else {
      setItemCount(0);
    }
  }, [open, calculatedItemCount, setItemCount]);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      setRenderOpen(true);
    } else {
      setRenderOpen(false);
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!isMounted) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg transition-all duration-200 ease-out ${
        renderOpen
          ? 'animate-in fade-in-0 zoom-in-95'
          : 'invisible animate-out fade-out-0 zoom-out-95'
      } ${className}`}
      role="menu"
      style={{ transformOrigin: 'top center' }}
    >
      {children}
    </div>
  );
}

DropdownContent.displayName = 'DropdownContent';

/* -------------------------------------------------------------------------------------------------
 * Dropdown Item
 * -----------------------------------------------------------------------------------------------*/

function DropdownItem({
  children,
  className = '',
  onClick,
  selected = false,
  index = 0,
}: DropdownItemProps) {
  const { setOpen, focusedIndex } = useDropdownContext();
  const isFocused = focusedIndex === index;

  const handleClick = () => {
    if (selected) return;
    onClick?.();
    setOpen(false);
  };

  const stateStyles = selected
    ? 'bg-blue-50 text-blue-600 font-medium cursor-default'
    : isFocused
      ? 'bg-gray-200 text-gray-900'
      : 'text-gray-900 hover:bg-gray-200';

  return (
    <button
      type="button"
      className={`w-full px-3 py-2 text-body-16-m focus:outline-none ${stateStyles} ${className}`}
      onClick={handleClick}
      role="option"
      aria-selected={selected}
      data-dropdown-item
      data-index={index}
    >
      {children}
    </button>
  );
}

DropdownItem.displayName = 'DropdownItem';

/* -------------------------------------------------------------------------------------------------
 * Dropdown Separator
 * -----------------------------------------------------------------------------------------------*/

function DropdownSeparator({ className = '' }: { className?: string }) {
  return <div className={`-mx-1 my-1 h-px bg-gray-200 ${className}`} role="separator" />;
}

DropdownSeparator.displayName = 'DropdownSeparator';

/* -------------------------------------------------------------------------------------------------
 * export Dropdown
 * -----------------------------------------------------------------------------------------------*/

Dropdown.Trigger = DropdownTrigger;
Dropdown.Overlay = DropdownOverlay;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
Dropdown.Separator = DropdownSeparator;

export default Dropdown;

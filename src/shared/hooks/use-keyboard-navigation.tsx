import { useState, useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  isOpen: boolean;
  itemCount: number;
  initialIndex?: number;
  onSelect?: (index: number) => void;
  onEscape?: () => void;
}

export function useKeyboardNavigation({
  isOpen,
  itemCount,
  initialIndex = -1,
  onSelect,
  onEscape,
}: UseKeyboardNavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const scrollToItem = useCallback((index: number) => {
    const item = document.querySelector(
      `[data-dropdown-item][data-index="${index}"]`,
    ) as HTMLElement;

    if (item) {
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen || itemCount === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev + 1;
            const newIndex = nextIndex >= itemCount ? itemCount - 1 : nextIndex;
            scrollToItem(newIndex);

            return newIndex;
          });
          break;

        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev - 1;
            const newIndex = nextIndex < 0 ? 0 : nextIndex;
            scrollToItem(newIndex);

            return newIndex;
          });
          break;

        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < itemCount) {
            onSelect?.(focusedIndex);
          }
          break;

        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
      }
    },
    [isOpen, itemCount, focusedIndex, onSelect, onEscape, scrollToItem],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    focusedIndex,
    setFocusedIndex,
  };
}

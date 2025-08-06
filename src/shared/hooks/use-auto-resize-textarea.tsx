import { useRef, useLayoutEffect, useCallback } from 'react';

export const useAutoResizeTextarea = (value?: string, minHeight?: number) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const scrollHeight = el.scrollHeight;
      const finalHeight = minHeight ? Math.max(scrollHeight, minHeight) : scrollHeight;
      el.style.height = `${finalHeight}px`;
    }
  }, [minHeight]);

  useLayoutEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  return { textareaRef, resizeTextarea };
};

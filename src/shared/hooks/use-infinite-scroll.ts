import { useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteScroll = <T extends HTMLElement = HTMLDivElement>({
  fetchNextPage,
  hasNextPage,
  isFetching,
  rootMargin = '0px',
  threshold = 0.1,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: T | null) => {
      if (isFetching) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasNextPage && !isFetching) {
            fetchNextPage();
          }
        },
        {
          rootMargin,
          threshold,
        },
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [fetchNextPage, hasNextPage, isFetching, rootMargin, threshold],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
};

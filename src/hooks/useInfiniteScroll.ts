import { RefObject, useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load (default: 200px)
  debounceDelay?: number; // Delay before allowing next load (default: 300ms)
}

function useInfiniteScroll(
  containerRef: RefObject<HTMLElement>,
  onLoadMore: () => void,
  hasMore: boolean,
  loading: boolean,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 200, debounceDelay = 300 } = options;
  const isLoadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !hasMore || loading || isLoadingRef.current) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight + threshold;

    if (isNearBottom) {
      isLoadingRef.current = true;
      onLoadMore();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        isLoadingRef.current = false;
      }, debounceDelay);
    }
  }, [containerRef, onLoadMore, hasMore, loading, threshold, debounceDelay]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      // container.removeEventListener('scroll', handleScroll);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [containerRef, handleScroll]);

  useEffect(() => {
    if (loading) {
      isLoadingRef.current = false;
    }
  }, [loading]);
}

export default useInfiniteScroll;

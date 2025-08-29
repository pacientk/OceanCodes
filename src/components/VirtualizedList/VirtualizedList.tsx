import React, { memo, ReactNode, useCallback, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Reviewer, User } from '../../types';
import { LIST_CONSTANTS, UI_CONSTANTS } from '../../utils';
import { EmptyState, ErrorMessage, LoadingSpinner } from '../';
import { useInfiniteScroll } from '../../hooks';

interface VirtualizedListProps {
  data: (User | Reviewer)[];
  renderItem: (item: User | Reviewer) => ReactNode;
  height: number;
  width?: string;
  onLoadMore: () => void;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  searchQuery?: string;
  onRetry?: () => void;
}

interface VirtualItemProps {
  virtualItem: { size: number; start: number };
  className: string;
  children: ReactNode;
}

const VirtualizedList: React.FC<VirtualizedListProps> = memo(
  ({
    data,
    renderItem,
    height,
    width = '100%',
    onLoadMore,
    loading,
    error,
    hasMore,
    searchQuery = '',
    onRetry,
  }) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const containerStyle = useMemo(() => ({ height, width }), [height, width]);

    const virtualizerConfig = useMemo(
      () => ({
        count: data.length + (hasMore ? 1 : 0),
        getScrollElement: () => parentRef.current,
        estimateSize: () => LIST_CONSTANTS.ITEM_HEIGHT,
        scrollMargin: 12,
        gap: UI_CONSTANTS.GAP,
      }),
      [data.length, hasMore]
    );

    const virtualizer = useVirtualizer(virtualizerConfig);

    const scrollContainerStyle = useMemo(
      () => ({
        height: `${virtualizer.getTotalSize()}px`,
      }),
      [virtualizer.getTotalSize()]
    );

    const onLoadMoreRef = useRef(onLoadMore);
    onLoadMoreRef.current = onLoadMore;

    const debouncedLoadMore = useCallback(() => {
      if (!hasMore || loading) return;
      onLoadMoreRef.current();
    }, [hasMore, loading]);

    const virtualItems = virtualizer.getVirtualItems();

    const renderedItems = useMemo(() => {
      return virtualItems.map(virtualItem => {
        const isLast = virtualItem.index === data.length;

        if (isLast && hasMore) {
          return (
            <VirtualItem
              key="loading-more"
              virtualItem={virtualItem}
              className="flex items-center justify-center absolute top-0 left-0 w-full"
            >
              <LoadingSpinner size="medium" />
            </VirtualItem>
          );
        }

        const item = data[virtualItem.index];
        if (!item) return null;

        return (
          <VirtualItem
            key={item.id}
            virtualItem={virtualItem}
            className="px-2.5 absolute top-0 left-0 w-full"
          >
            {renderItem(item)}
          </VirtualItem>
        );
      });
    }, [virtualItems, data, hasMore, renderItem]);

    useInfiniteScroll(parentRef, debouncedLoadMore, hasMore, loading);

    if (error) {
      return (
        <div style={containerStyle} className="flex items-center justify-center">
          <ErrorMessage message={error} onRetry={onRetry} />
        </div>
      );
    }

    if (!loading && data.length === 0) {
      return (
        <div style={containerStyle} className="flex items-center justify-center">
          <EmptyState type={searchQuery ? 'no-results' : 'no-data'} searchQuery={searchQuery} />
        </div>
      );
    }

    return (
      <div ref={parentRef} style={containerStyle} className="overflow-auto scrollbar-thin">
        <div className="relative w-full" style={scrollContainerStyle}>
          {renderedItems}
        </div>

        {loading && data.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="large" />
          </div>
        )}
      </div>
    );
  }
);

const VirtualItem = memo<VirtualItemProps>(({ virtualItem, className, children }) => {
  const style = useMemo(
    () => ({
      height: `${virtualItem.size}px`,
      transform: `translateY(${virtualItem.start}px)`,
    }),
    [virtualItem.size, virtualItem.start]
  );

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
});

VirtualItem.displayName = 'VirtualItem';
VirtualizedList.displayName = 'VirtualizedList';

export default VirtualizedList;

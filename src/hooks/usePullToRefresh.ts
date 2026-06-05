import { useCallback, useEffect, useRef, useState } from 'react';

export const PTR_THRESHOLD = 80; // raw px before refresh triggers
const MAX_VISUAL = 110; // cap on visual pull distance
const RESISTANCE = 0.4; // applied to pull distance past threshold

export interface PullState {
  pullDistance: number; // visual distance (with resistance applied)
  isRefreshing: boolean;
  isPulling: boolean;
  isReady: boolean; // raw distance has passed threshold
}

interface Options {
  onRefresh: () => Promise<void> | void;
  disabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  disabled = false,
}: Options): PullState {
  const [state, setState] = useState<PullState>({
    pullDistance: 0,
    isRefreshing: false,
    isPulling: false,
    isReady: false,
  });

  const startYRef = useRef(0);
  const rawPullRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || isRefreshingRef.current) return;
      if (window.scrollY > 0) return;
      startYRef.current = e.touches[0].clientY;
      rawPullRef.current = 0;
      isDraggingRef.current = true;
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current || disabled || isRefreshingRef.current) return;

      const rawDelta = e.touches[0].clientY - startYRef.current;
      if (rawDelta <= 0) {
        rawPullRef.current = 0;
        setState({
          pullDistance: 0,
          isRefreshing: false,
          isPulling: false,
          isReady: false,
        });
        return;
      }

      rawPullRef.current = rawDelta;

      const visual =
        rawDelta <= PTR_THRESHOLD
          ? rawDelta
          : PTR_THRESHOLD + (rawDelta - PTR_THRESHOLD) * RESISTANCE;

      setState({
        pullDistance: Math.min(visual, MAX_VISUAL),
        isRefreshing: false,
        isPulling: true,
        isReady: rawDelta >= PTR_THRESHOLD,
      });

      if (window.scrollY === 0) e.preventDefault();
    },
    [disabled]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const rawPull = rawPullRef.current;
    rawPullRef.current = 0;

    if (rawPull >= PTR_THRESHOLD) {
      isRefreshingRef.current = true;
      setState({
        pullDistance: 0,
        isRefreshing: true,
        isPulling: false,
        isReady: false,
      });
      try {
        await onRefreshRef.current();
      } finally {
        isRefreshingRef.current = false;
        setState({
          pullDistance: 0,
          isRefreshing: false,
          isPulling: false,
          isReady: false,
        });
      }
    } else {
      setState({
        pullDistance: 0,
        isRefreshing: false,
        isPulling: false,
        isReady: false,
      });
    }
  }, []);

  const handleTouchCancel = useCallback(() => {
    isDraggingRef.current = false;
    rawPullRef.current = 0;
    setState({
      pullDistance: 0,
      isRefreshing: false,
      isPulling: false,
      isReady: false,
    });
  }, []);

  useEffect(() => {
    if (disabled) return;
    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    disabled,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  ]);

  return state;
}

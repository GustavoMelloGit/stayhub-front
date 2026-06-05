import { type FC, type PropsWithChildren } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePullToRefresh, PTR_THRESHOLD } from '@/hooks/usePullToRefresh';

const SIZE = 44;
const RADIUS = 14;
const CIRC = 2 * Math.PI * RADIUS;

export const PullToRefresh: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();

  const { pullDistance, isRefreshing, isPulling, isReady } = usePullToRefresh({
    onRefresh: () => queryClient.invalidateQueries(),
  });

  const isActive = isPulling || isRefreshing;
  const progress = Math.min(pullDistance / PTR_THRESHOLD, 1);
  const strokeDashoffset = CIRC * (1 - progress);

  // Slides from -SIZE (hidden above topbar) to 0 (fully visible) as progress goes 0→1.
  // During refresh, pullDistance is 0 so progress=0; keep it visible at 0.
  const indicatorSlideY = isRefreshing ? 0 : (progress - 1) * SIZE;

  let srText = '';
  if (isRefreshing) srText = 'Atualizando...';
  else if (isReady) srText = 'Solte para atualizar';

  return (
    <>
      {/* Refresh indicator: fixed, centered, slides in from above the topbar */}
      <div
        role='status'
        aria-live='polite'
        aria-atomic='true'
        className='pointer-events-none fixed left-1/2 z-50'
        style={{
          top: `calc(var(--header-height) + 8px)`,
          width: SIZE,
          height: SIZE,
          transform: `translateX(-50%) translateY(${isActive ? indicatorSlideY : -SIZE}px)`,
          opacity: isActive ? 1 : 0,
          transition: isPulling
            ? 'none'
            : 'transform 0.25s ease-out, opacity 0.25s ease-out',
        }}
      >
        <span className='sr-only'>{srText}</span>

        <div className='relative flex h-full w-full items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border'>
          {/* Progress arc ring */}
          <svg
            aria-hidden='true'
            className='-rotate-90 absolute inset-0'
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
          >
            {/* Track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill='none'
              strokeWidth='2.5'
              className='stroke-border'
            />
            {/* Fill */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill='none'
              strokeWidth='2.5'
              strokeLinecap='round'
              className={cn(
                isReady || isRefreshing
                  ? 'stroke-primary'
                  : 'stroke-muted-foreground'
              )}
              style={{
                strokeDasharray: CIRC,
                strokeDashoffset: isRefreshing ? 0 : strokeDashoffset,
                transition: isPulling
                  ? 'none'
                  : 'stroke-dashoffset 0.15s ease-out',
              }}
            />
          </svg>

          {/* Center icon */}
          <RefreshCw
            aria-hidden='true'
            className={cn(
              'size-4 transition-all duration-200',
              isReady || isRefreshing
                ? 'text-primary'
                : 'text-muted-foreground',
              isReady && !isRefreshing && 'rotate-180',
              isRefreshing && 'animate-spin'
            )}
          />
        </div>
      </div>

      {/* Content — translates down to give physical pull feel */}
      <div
        className='min-w-0 flex-1 overflow-x-hidden'
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.25s ease-out',
        }}
      >
        {children}
      </div>
    </>
  );
};

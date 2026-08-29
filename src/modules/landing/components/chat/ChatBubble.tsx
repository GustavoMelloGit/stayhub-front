import { Check, ImageIcon, Play } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { DemoMessage } from './chatScript';

/** Alturas fixas para a onda do áudio: um array constante evita re-render aleatório. */
const WAVEFORM = [
  30, 62, 44, 88, 54, 96, 40, 72, 100, 58, 34, 80, 46, 92, 38, 68, 52, 86, 42,
  74, 30, 64, 48, 90, 36, 70, 44, 58,
];

const Shell = ({
  isUser,
  children,
}: {
  isUser: boolean;
  children: ReactNode;
}) => (
  <div
    className={cn(
      'lp-pop flex w-full',
      isUser ? 'justify-end' : 'justify-start'
    )}
  >
    <div
      className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3 text-base leading-relaxed md:text-lg',
        isUser
          ? 'bg-lp-bubble-out text-lp-text rounded-br-md'
          : 'bg-lp-bubble-in text-lp-text border-lp-border rounded-bl-md border'
      )}
    >
      {children}
    </div>
  </div>
);

export const ChatBubble = ({ message }: { message: DemoMessage }) => {
  const isUser = message.from === 'user';

  if (message.kind === 'voice') {
    return (
      <Shell isUser={isUser}>
        <div className='flex items-center gap-3'>
          <span className='bg-lp-brand text-lp-on-brand flex size-9 shrink-0 items-center justify-center rounded-full'>
            <Play className='size-4 fill-current' aria-hidden />
          </span>
          <span className='flex h-8 items-end gap-[3px]' aria-hidden>
            {WAVEFORM.map((height, index) => (
              <span
                key={index}
                className='bg-lp-text/55 w-[3px] rounded-full'
                style={{ height: `${Math.max(height * 0.28, 4)}px` }}
              />
            ))}
          </span>
          <span className='text-lp-text shrink-0 text-sm'>
            {message.duration}
          </span>
        </div>
        <p className='text-lp-text mt-2 text-sm italic md:text-base'>
          “{message.transcript}”
        </p>
        <Ticks />
      </Shell>
    );
  }

  if (message.kind === 'photo') {
    return (
      <Shell isUser={isUser}>
        <div className='border-lp-border bg-lp-surface flex items-center gap-3 rounded-xl border p-3'>
          <ReceiptThumb />
          <span className='text-lp-muted flex min-w-0 items-center gap-2 text-sm'>
            <ImageIcon className='size-4 shrink-0' aria-hidden />
            <span className='truncate'>{message.fileName}</span>
          </span>
        </div>
        <p className='mt-2'>{message.caption}</p>
        <Ticks />
      </Shell>
    );
  }

  return (
    <Shell isUser={isUser}>
      <p>{message.text}</p>
      {isUser ? <Ticks /> : null}
    </Shell>
  );
};

const Ticks = () => (
  <span
    className='text-lp-brand mt-1 flex items-center justify-end gap-0.5'
    aria-hidden
  >
    <Check className='size-3.5' />
    <Check className='-ml-2.5 size-3.5' />
  </span>
);

/** Miniatura desenhada em SVG: evita carregar imagem e funciona nos dois temas. */
const ReceiptThumb = () => (
  <svg
    viewBox='0 0 40 48'
    className='border-lp-border h-12 w-10 shrink-0 rounded-md border'
    role='img'
    aria-hidden
  >
    <rect width='40' height='48' className='fill-lp-elevated' />
    {[10, 16, 22, 28, 34].map((y, index) => (
      <rect
        key={y}
        x='7'
        y={y}
        width={index % 2 === 0 ? 26 : 18}
        height='2.5'
        rx='1.25'
        className='fill-lp-muted opacity-70'
      />
    ))}
  </svg>
);

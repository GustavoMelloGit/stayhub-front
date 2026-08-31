import type { CSSProperties } from 'react';

/** As bolinhas pulsam pela classe `lp-dot`, definida em `src/index.css`. */
export const TypingIndicator = () => (
  <div className='bg-lp-bubble-in border-lp-border lp-pop inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border px-4 py-3.5'>
    {[0, 1, 2].map(index => (
      <span
        key={index}
        className='bg-lp-muted lp-dot size-2 rounded-full'
        style={{ '--lp-delay': `${index * 160}ms` } as CSSProperties}
      />
    ))}
  </div>
);

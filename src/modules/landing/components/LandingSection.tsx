import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LandingSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headingClassName?: string;
}

export const LandingSection = ({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  headingClassName,
}: LandingSectionProps) => (
  <section
    id={id}
    className={cn('scroll-mt-24 px-5 py-16 md:px-8 md:py-24', className)}
  >
    <div className='mx-auto w-full max-w-6xl'>
      {(eyebrow || title || subtitle) && (
        <div className={cn('mb-10 max-w-3xl md:mb-14', headingClassName)}>
          {eyebrow ? (
            <p className='text-lp-brand mb-3 text-base font-semibold tracking-wide uppercase'>
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className='text-lp-text text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl'>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className='text-lp-muted mt-4 text-lg md:text-xl'>{subtitle}</p>
          ) : null}
        </div>
      )}
      {children}
    </div>
  </section>
);

import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type LandingCtaProps = ComponentPropsWithoutRef<'a'> & {
  size?: 'compact' | 'default' | 'large';
};

/**
 * Botão principal da landing.
 *
 * Não reaproveita `@/components/ui/button` porque aquele resolve `--primary`,
 * que no tema claro do app é quase preto, sem contraste de marca. Aqui a cor
 * vem dos tokens `--lp-*`.
 *
 * Os CTAs de conversão (`default` e `large`) têm 56px e 64px de altura, acima
 * dos 48px recomendados para toque. O `compact` existe só para o botão do
 * cabeçalho, que é uma repetição do CTA e precisa conviver com a navegação sem
 * dominá-la.
 */
export const LandingCta = ({
  className,
  size = 'default',
  children,
  ...props
}: LandingCtaProps) => (
  <a
    className={cn(
      'inline-flex items-center justify-center rounded-full font-semibold',
      'bg-lp-brand text-lp-on-brand',
      'shadow-[0_18px_40px_-16px_var(--lp-glow)]',
      'transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0',
      'focus-visible:ring-lp-brand focus-visible:ring-offset-lp-bg outline-none focus-visible:ring-3 focus-visible:ring-offset-2',
      'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      size === 'large' && 'min-h-16 px-9 text-xl',
      size === 'default' && 'min-h-14 px-7 text-lg md:text-xl',
      size === 'compact' && 'min-h-11 px-5 text-base',
      className
    )}
    {...props}
  >
    {children}
  </a>
);

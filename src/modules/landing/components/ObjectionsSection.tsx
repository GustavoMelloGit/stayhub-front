import { useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import { LandingSection } from './LandingSection';

const ITEMS = ['item1', 'item2', 'item3', 'item4'] as const;

/**
 * Lista editorial, não cards.
 *
 * Pergunta à esquerda, resposta à direita, separadas por um fio. Sem caixa em
 * volta: a seção anterior já é uma conversa e a seguinte já é um formulário —
 * mais uma grade de retângulos aqui deixava as três indistinguíveis ao rolar.
 */
export const ObjectionsSection = () => {
  const { t } = useTranslation('landing');
  const ref = useRef<HTMLDivElement>(null);

  // Chegar até as objeções é o sinal mais forte de intenção da página — quem
  // lê isso está decidindo, não passeando.
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return;
        trackEvent('objections_reached');
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <LandingSection
      id='duvidas-comuns'
      eyebrow={t('objections.eyebrow')}
      title={t('objections.title')}
    >
      <div ref={ref} className='flex flex-col'>
        {ITEMS.map(item => (
          <div
            key={item}
            className='border-lp-border grid gap-3 border-t py-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12 md:py-10'
          >
            <h3 className='text-lp-text flex gap-3 text-xl font-semibold md:text-2xl'>
              {/* Quadradinho em vez de marcador tipográfico: ecoa a marca e
                  evita reintroduzir travessão na página. */}
              <span
                aria-hidden
                className='bg-lp-brand mt-2.5 size-2.5 shrink-0 rounded-[3px] md:mt-3'
              />
              {t(`objections.${item}.question`)}
            </h3>
            <p className='text-lp-muted text-base md:text-lg'>
              {t(`objections.${item}.answer`)}
            </p>
          </div>
        ))}
      </div>
    </LandingSection>
  );
};

import { useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import { LandingSection } from './LandingSection';

const ITEMS = ['item1', 'item2', 'item3', 'item4'] as const;

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
      <div ref={ref} className='grid gap-5 md:grid-cols-2 md:gap-6'>
        {ITEMS.map(item => (
          <div
            key={item}
            className='border-lp-border bg-lp-surface rounded-2xl border p-6 md:p-7'
          >
            <h3 className='text-lp-text text-xl font-semibold md:text-2xl'>
              {t(`objections.${item}.question`)}
            </h3>
            <p className='text-lp-muted mt-3 text-base md:text-lg'>
              {t(`objections.${item}.answer`)}
            </p>
          </div>
        ))}
      </div>
    </LandingSection>
  );
};

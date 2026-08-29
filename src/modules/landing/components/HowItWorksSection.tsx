import { MessageSquareText, Sparkles, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { LandingSection } from './LandingSection';

const STEPS = [
  { key: 'step1', Icon: MessageSquareText },
  { key: 'step2', Icon: Sparkles },
  { key: 'step3', Icon: TrendingUp },
] as const;

export const HowItWorksSection = () => {
  const { t } = useTranslation('landing');

  return (
    <LandingSection
      id='como-funciona'
      eyebrow={t('howItWorks.eyebrow')}
      title={t('howItWorks.title')}
    >
      <ol className='grid gap-5 md:grid-cols-3 md:gap-6'>
        {STEPS.map(({ key, Icon }, index) => (
          <li
            key={key}
            className='border-lp-border bg-lp-surface flex flex-col rounded-2xl border p-6 md:p-7'
          >
            <span className='bg-lp-brand-soft text-lp-brand mb-5 flex size-14 items-center justify-center rounded-2xl'>
              <Icon className='size-7' aria-hidden />
            </span>
            <span className='text-lp-brand mb-2 text-base font-semibold'>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className='text-lp-text text-xl font-semibold md:text-2xl'>
              {t(`howItWorks.${key}.title`)}
            </h3>
            <p className='text-lp-muted mt-3 text-base md:text-lg'>
              {t(`howItWorks.${key}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
};

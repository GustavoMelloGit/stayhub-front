import { MessageSquareText, Sparkles, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { LandingSection } from './LandingSection';

const STEPS = [
  { key: 'step1', Icon: MessageSquareText },
  { key: 'step2', Icon: Sparkles },
  { key: 'step3', Icon: TrendingUp },
] as const;

/**
 * Linha do tempo, não grade de cards.
 *
 * O conteúdo é uma sequência de verdade — você fala, ele entende, você
 * pergunta — então a numeração e o traço que liga os passos carregam
 * informação em vez de decorar. É também o que separa esta seção das
 * outras, que usam formas próprias pelo mesmo motivo.
 */
export const HowItWorksSection = () => {
  const { t } = useTranslation('landing');

  return (
    <LandingSection
      id='como-funciona'
      eyebrow={t('howItWorks.eyebrow')}
      title={t('howItWorks.title')}
    >
      <ol className='grid gap-10 md:grid-cols-3 md:gap-8'>
        {STEPS.map(({ key, Icon }, index) => (
          <li key={key} className='relative flex gap-5 md:flex-col md:gap-0'>
            {/* Traço até o próximo passo. Fica em cada item, e não um único
                traço no container, para terminar exatamente no último círculo
                em vez de correr até a borda. Vertical no mobile (`gap-10`),
                horizontal a partir de `md` (`gap-8`). */}
            {index < STEPS.length - 1 && (
              <span
                aria-hidden
                className='bg-lp-border absolute top-14 bottom-[-2.5rem] left-7 w-px md:top-7 md:right-[-2rem] md:bottom-auto md:left-14 md:h-px md:w-auto'
              />
            )}

            <span className='border-lp-brand bg-lp-bg text-lp-brand relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 md:mb-6'>
              <Icon className='size-6' aria-hidden />
            </span>

            <div className='pt-1 md:pt-0'>
              <span className='text-lp-brand block text-base font-semibold tracking-wide'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className='text-lp-text mt-1 text-xl font-semibold md:text-2xl'>
                {t(`howItWorks.${key}.title`)}
              </h3>
              <p className='text-lp-muted mt-3 max-w-sm text-base md:text-lg'>
                {t(`howItWorks.${key}.body`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
};

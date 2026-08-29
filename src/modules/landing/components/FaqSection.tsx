import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { LandingSection } from './LandingSection';
import { FAQ_ITEM_KEYS } from '../seo/structuredData';

/**
 * Usa `<details>` nativo de propósito: a resposta continua no HTML mesmo
 * fechada, então buscadores e crawlers de IA leem tudo, e o teclado funciona
 * sem uma linha de JavaScript.
 */
export const FaqSection = () => {
  const { t } = useTranslation('landing');

  return (
    <LandingSection
      id='duvidas'
      eyebrow={t('faq.eyebrow')}
      title={t('faq.title')}
    >
      <div className='flex flex-col gap-3'>
        {FAQ_ITEM_KEYS.map(item => (
          <details
            key={item}
            className='border-lp-border bg-lp-surface group rounded-2xl border open:pb-2'
          >
            <summary className='text-lp-text flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-lg font-semibold md:text-xl [&::-webkit-details-marker]:hidden'>
              {t(`faq.${item}.question`)}
              <ChevronDown
                className='text-lp-brand size-6 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none'
                aria-hidden
              />
            </summary>
            {/* O card ocupa a largura toda, mas a resposta mantém a medida de
                leitura: a 1152px o texto passaria de 90 caracteres por linha. */}
            <p className='text-lp-muted max-w-3xl px-5 pb-4 text-base md:text-lg'>
              {t(`faq.${item}.answer`)}
            </p>
          </details>
        ))}
      </div>
    </LandingSection>
  );
};

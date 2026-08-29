import { useTranslation } from '@/i18n/useTranslation';
import { LandingSection } from './LandingSection';

const ITEMS = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] as const;

export const AnswersSection = () => {
  const { t } = useTranslation('landing');

  return (
    <LandingSection
      id='respostas'
      eyebrow={t('answers.eyebrow')}
      title={t('answers.title')}
      subtitle={t('answers.subtitle')}
      className='bg-lp-surface/40'
    >
      <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {ITEMS.map(item => (
          <li
            key={item}
            className='border-lp-border bg-lp-bubble-in text-lp-text rounded-2xl rounded-bl-md border px-5 py-4 text-base md:text-lg'
          >
            “{t(`answers.${item}`)}”
          </li>
        ))}
      </ul>
    </LandingSection>
  );
};

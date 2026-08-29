import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { LandingSection } from './LandingSection';

const ITEMS = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] as const;

/**
 * Conversa, não grade.
 *
 * As seis são perguntas do próprio usuário, então todas usam a cor da bolha
 * de saída: colori-las como um diálogo sugeriria uma troca que não existe. O
 * que alterna é só a posição, que dá ritmo sem afirmar nada. Uma grade de seis
 * retângulos idênticos dizia "lista de features"; isto diz "é assim que você
 * vai falar com ele", que é a tese da página.
 */
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
      <ul className='flex max-w-3xl flex-col gap-3'>
        {ITEMS.map((item, index) => {
          const alignEnd = index % 2 === 1;

          return (
            <li
              key={item}
              className={cn('flex', alignEnd ? 'justify-end' : 'justify-start')}
            >
              <p
                className={cn(
                  'bg-lp-bubble-out text-lp-text max-w-[85%] rounded-2xl px-5 py-4 text-base md:text-lg',
                  alignEnd ? 'rounded-br-md' : 'rounded-bl-md'
                )}
              >
                {t(`answers.${item}`)}
              </p>
            </li>
          );
        })}
      </ul>
    </LandingSection>
  );
};

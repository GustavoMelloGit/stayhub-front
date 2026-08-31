import { useTranslation } from '@/i18n/useTranslation';
import { LandingSection } from './LandingSection';

const ITEMS = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] as const;

/**
 * Sugestões de pergunta, não bolhas de conversa.
 *
 * As seis são perguntas da mesma pessoa, então qualquer coisa que pareça uma
 * troca de mensagens mente: não há dois lados. O formato de pílula é o que já
 * se reconhece como "coisas que dá para perguntar", e a largura de cada uma
 * vem do próprio texto, o que preenche a linha sem grade nem coluna fixa.
 */
export const AnswersSection = () => {
  const { t } = useTranslation('landing');

  return (
    <LandingSection
      id='respostas'
      eyebrow={t('answers.eyebrow')}
      title={t('answers.title')}
      subtitle={t('answers.subtitle')}
      band
    >
      {/* `flex-1` sobre uma base larga: as pílulas crescem para fechar a
          linha em vez de deixarem um vão à direita, e a quantidade por linha
          se ajusta sozinha conforme a largura da tela. */}
      <ul className='flex flex-wrap gap-3'>
        {ITEMS.map(item => (
          <li key={item} className='flex flex-1 basis-[26rem]'>
            <span className='border-lp-border bg-lp-elevated text-lp-text flex w-full items-center rounded-full border px-6 py-4 text-base md:text-lg'>
              {t(`answers.${item}`)}
            </span>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
};

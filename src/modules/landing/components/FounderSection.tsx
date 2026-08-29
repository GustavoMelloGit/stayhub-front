import { Check } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { LandingSection } from './LandingSection';
import { WaitlistForm } from './WaitlistForm';

const BENEFITS = ['benefit1', 'benefit2', 'benefit3', 'benefit4'] as const;

export const FounderSection = () => {
  const { t } = useTranslation('landing');

  return (
    <LandingSection id='lista'>
      <div className='grid items-start gap-10 lg:grid-cols-2 lg:gap-16'>
        <div>
          <p className='text-lp-brand mb-3 text-base font-semibold tracking-wide uppercase'>
            {t('founder.eyebrow')}
          </p>
          <h2 className='text-lp-text text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl'>
            {t('founder.title')}
          </h2>
          <p className='text-lp-muted mt-5 text-lg md:text-xl'>
            {t('founder.body')}
          </p>

          {/* O preço normal riscado ancora a oferta: sem ele "R$ 25" é só um
              número, com ele vira desconto. O rótulo em texto acompanha o
              risco, porque tachado sozinho é um sinal só visual. */}
          <div className='border-lp-brand bg-lp-brand-soft mt-8 inline-flex flex-wrap items-end gap-x-4 gap-y-2 rounded-2xl border px-6 py-5'>
            <p className='flex items-baseline gap-1'>
              <span className='text-lp-brand text-4xl font-bold md:text-5xl'>
                {t('founder.priceValue')}
              </span>
              <span className='text-lp-text text-lg md:text-xl'>
                {t('founder.pricePeriod')}
              </span>
            </p>
            <p className='text-lp-muted pb-1 text-base'>
              {t('founder.priceRegularLabel')}{' '}
              <s>{t('founder.priceRegularValue')}</s>
            </p>
          </div>

          <p className='text-lp-text mt-4 text-base md:text-lg'>
            <span className='text-lp-brand font-semibold'>
              {t('founder.seatsValue')}
            </span>{' '}
            {t('founder.seatsLabel')}
          </p>

          <ul className='mt-8 flex flex-col gap-4'>
            {BENEFITS.map(benefit => (
              <li key={benefit} className='flex items-start gap-3'>
                {/* O invólucro tem a altura de uma linha de texto (1.6em, a
                    entrelinha da landing), então o círculo centraliza na
                    primeira linha em qualquer tamanho de fonte. Uma margem
                    fixa acertava num breakpoint e errava no outro, e itens que
                    quebram em duas linhas no mobile precisam do alinhamento
                    pelo topo. */}
                <span className='flex h-[1.6em] shrink-0 items-center text-base md:text-lg'>
                  <span className='bg-lp-brand text-lp-on-brand flex size-6 items-center justify-center rounded-full'>
                    <Check className='size-4' aria-hidden />
                  </span>
                </span>
                <span className='text-lp-text text-base md:text-lg'>
                  {t(`founder.${benefit}`)}
                </span>
              </li>
            ))}
          </ul>

          <p className='text-lp-muted mt-8 text-base'>
            {t('founder.disclaimer')}
          </p>
        </div>

        <div>
          <WaitlistForm />
        </div>
      </div>
    </LandingSection>
  );
};

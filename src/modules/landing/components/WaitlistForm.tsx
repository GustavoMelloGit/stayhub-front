import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { withMask } from 'use-mask-input';
import { CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import {
  PROPERTY_COUNT_RANGES,
  waitlistFormSchema,
  type PropertyCountRange,
  type WaitlistFormData,
} from '../service/waitlist.schema';
import { useJoinWaitlist } from '../service/WaitlistService.hooks';

/** Aceita fixo (10 dígitos) e móvel (11), na ordem em que o inputmask testa. */
const WHATSAPP_MASK = ['(99) 9999-9999', '(99) 99999-9999'];

const COUNT_LABEL_KEYS: Record<PropertyCountRange, string> = {
  '1': 'form.count1',
  '2-3': 'form.count2to3',
  '4-10': 'form.count4to10',
  '10+': 'form.count10plus',
};

const FIELD_CLASSES =
  'border-lp-border bg-lp-elevated text-lp-text placeholder:text-lp-muted focus-visible:border-lp-brand focus-visible:ring-lp-brand/40 h-14 rounded-xl px-4 text-lg md:text-lg';

/**
 * Mensagem de erro traduzida. O schema guarda apenas a chave do erro para que a
 * validação continue vivendo na camada de serviço, sem depender do i18n.
 */
const TranslatedMessage = () => {
  const { error, formMessageId } = useFormField();
  const { t } = useTranslation('landing');

  if (!error?.message) return null;

  return (
    <p
      id={formMessageId}
      role='alert'
      className='mt-1.5 text-base font-medium text-red-400'
    >
      {t(`form.errors.${error.message}`)}
    </p>
  );
};

export const WaitlistForm = () => {
  const { t } = useTranslation('landing');
  const { joinWaitlist, isJoining, hasJoined, joinError } = useJoinWaitlist();

  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const lastFieldRef = useRef<string>('name');

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: { name: '', whatsapp: '', propertyCount: undefined },
  });

  const handleFieldFocus = useCallback((field: string) => {
    lastFieldRef.current = field;
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent('form_start');
  }, []);

  // Sem o campo em que a pessoa parou não dá para saber se pedir o WhatsApp
  // está derrubando a conversão — que é a hipótese mais provável neste público.
  useEffect(() => {
    const reportAbandon = () => {
      if (!startedRef.current || submittedRef.current) return;
      submittedRef.current = true;
      trackEvent('form_abandon', { field: lastFieldRef.current });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') reportAbandon();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reportAbandon();
    };
  }, []);

  const onSubmit = (data: WaitlistFormData) => {
    submittedRef.current = true;
    trackEvent('form_submit', { count: String(data.propertyCount) });
    joinWaitlist(waitlistFormSchema.parse(data));
  };

  if (hasJoined) {
    return (
      <div
        className='border-lp-brand bg-lp-brand-soft rounded-2xl border p-6 text-center md:p-8'
        role='status'
      >
        <CheckCircle2 className='text-lp-brand mx-auto size-12' aria-hidden />
        <h3 className='text-lp-text mt-4 text-2xl font-bold'>
          {t('form.successTitle')}
        </h3>
        <p className='text-lp-muted mt-2 text-base md:text-lg'>
          {t('form.successBody')}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='border-lp-border bg-lp-surface flex flex-col gap-5 rounded-2xl border p-6 md:p-8'
        noValidate
      >
        <h3 className='text-lp-text text-2xl font-bold md:text-3xl'>
          {t('form.title')}
        </h3>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lp-text text-base md:text-lg'>
                {t('form.nameLabel')}
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete='name'
                  placeholder={t('form.namePlaceholder')}
                  className={FIELD_CLASSES}
                  {...field}
                  onFocus={() => handleFieldFocus('name')}
                />
              </FormControl>
              <TranslatedMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='whatsapp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lp-text text-base md:text-lg'>
                {t('form.whatsappLabel')}
              </FormLabel>
              <FormControl ref={withMask(WHATSAPP_MASK)}>
                <Input
                  inputMode='numeric'
                  autoComplete='tel-national'
                  placeholder={t('form.whatsappPlaceholder')}
                  className={FIELD_CLASSES}
                  {...field}
                  onFocus={() => handleFieldFocus('whatsapp')}
                />
              </FormControl>
              <TranslatedMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='propertyCount'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lp-text text-base md:text-lg'>
                {t('form.countLabel')}
              </FormLabel>
              <div
                className='mt-1 grid grid-cols-2 gap-3 sm:grid-cols-4'
                role='radiogroup'
                aria-label={t('form.countLabel')}
              >
                {PROPERTY_COUNT_RANGES.map(range => {
                  const selected = field.value === range;
                  return (
                    <button
                      key={range}
                      type='button'
                      role='radio'
                      aria-checked={selected}
                      onClick={() => {
                        handleFieldFocus('propertyCount');
                        field.onChange(range);
                      }}
                      className={cn(
                        'min-h-14 rounded-xl border text-lg font-medium transition-colors',
                        'focus-visible:ring-lp-brand outline-none focus-visible:ring-3',
                        selected
                          ? 'border-lp-brand bg-lp-brand text-lp-on-brand'
                          : 'border-lp-border bg-lp-elevated text-lp-text hover:border-lp-brand'
                      )}
                    >
                      {t(COUNT_LABEL_KEYS[range])}
                    </button>
                  );
                })}
              </div>
              <TranslatedMessage />
            </FormItem>
          )}
        />

        <button
          type='submit'
          disabled={isJoining}
          className={cn(
            'bg-lp-brand text-lp-on-brand min-h-16 rounded-full text-xl font-semibold',
            'shadow-[0_18px_40px_-16px_var(--lp-glow)] transition-transform duration-200',
            'hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:opacity-70',
            'focus-visible:ring-lp-brand focus-visible:ring-offset-lp-surface outline-none focus-visible:ring-3 focus-visible:ring-offset-2',
            'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
          )}
        >
          {isJoining ? t('form.submitting') : t('form.submit')}
        </button>

        {joinError ? (
          <p role='alert' className='text-base font-medium text-red-400'>
            {t('form.errors.generic')}
          </p>
        ) : null}

        <p className='text-lp-muted text-base'>{t('form.trigger')}</p>
        <p className='text-lp-muted text-sm'>{t('form.privacy')}</p>
      </form>
    </Form>
  );
};

import { cn } from '@/lib/utils';
import type { Language } from '@/i18n/language';
import { useTranslation } from '@/i18n/useTranslation';

/**
 * Ordem de exibição, com o português primeiro. Não usa `SUPPORTED_LANGUAGES`
 * porque a ordem daquela lista é de configuração do i18next, não de interface.
 * Os rótulos são códigos de idioma, não copy: não passam pelo i18n.
 */
const OPTIONS: { code: Language; label: string }[] = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
];

interface LanguageToggleProps {
  language: Language;
  onSelect: (language: Language) => void;
  className?: string;
}

/**
 * Seletor de idioma segmentado.
 *
 * Mostra as duas opções com a ativa preenchida, em vez de um botão que alterna:
 * quem chega já vê que existe versão no seu idioma sem precisar deduzir o que
 * o botão faria. Os rótulos usam 14px, e não os 11px comuns nesse controle,
 * porque parte do público tem 50+ anos.
 */
export const LanguageToggle = ({
  language,
  onSelect,
  className,
}: LanguageToggleProps) => {
  const { t } = useTranslation('landing');

  return (
    <div
      role='group'
      aria-label={t('nav.languageGroup')}
      className={cn(
        'border-lp-border bg-lp-elevated inline-flex items-center gap-0.5 rounded-full border p-1',
        className
      )}
    >
      {OPTIONS.map(({ code, label }) => {
        const active = code === language;

        return (
          <button
            key={code}
            type='button'
            lang={code}
            aria-pressed={active}
            onClick={() => onSelect(code)}
            className={cn(
              'min-h-9 rounded-full px-3 text-sm font-semibold transition-colors',
              'focus-visible:ring-lp-brand outline-none focus-visible:ring-2',
              // O preenchimento do ativo é neutro, não a cor de marca: o teal
              // fica reservado ao CTA, que precisa ser o único ponto de
              // atenção forte do cabeçalho.
              active
                ? 'bg-lp-text text-lp-bg'
                : 'text-lp-muted hover:text-lp-text'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

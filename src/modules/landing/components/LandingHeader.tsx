import { Languages, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import type { LandingTheme } from '../lib/useLandingTheme';
import { LandingCta } from './LandingCta';

interface LandingHeaderProps {
  theme: LandingTheme;
  onToggleTheme: () => void;
  onSwitchLanguage: () => void;
  languageLabel: string;
}

const NAV_ITEMS = [
  { href: '#como-funciona', key: 'nav.howItWorks' },
  { href: '#respostas', key: 'nav.answers' },
  { href: '#duvidas', key: 'nav.faq' },
] as const;

export const LandingHeader = ({
  theme,
  onToggleTheme,
  onSwitchLanguage,
  languageLabel,
}: LandingHeaderProps) => {
  const { t } = useTranslation('landing');

  return (
    <header className='border-lp-border bg-lp-bg/85 sticky top-0 z-50 border-b backdrop-blur-md'>
      <a
        href='#conteudo'
        className='bg-lp-brand text-lp-on-brand sr-only rounded-b-lg px-4 py-2 focus:not-sr-only focus:absolute focus:top-0 focus:left-4'
      >
        {t('nav.skipToContent')}
      </a>

      <div className='mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-3 md:px-8 md:py-4'>
        <Link
          to={ROUTES.landing}
          className='text-lp-text text-xl font-bold tracking-tight md:text-2xl'
        >
          Sogio
        </Link>

        {/* Os links de seção ficam centrados, e idioma e tema ficam no grupo
            da direita com o mesmo formato de pílula: sem isso "English" lê como
            mais um link de seção em vez de um controle. */}
        <nav
          aria-label='Menu'
          className='mx-auto hidden items-center gap-6 lg:flex'
        >
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className='text-lp-muted hover:text-lp-text text-base transition-colors'
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className='ml-auto flex items-center gap-2 lg:ml-0'>
          <button
            type='button'
            onClick={onSwitchLanguage}
            aria-label={languageLabel}
            className={cn(
              'border-lp-border text-lp-muted hover:text-lp-text hover:border-lp-brand',
              'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border transition-colors',
              'sm:px-4 sm:text-base'
            )}
          >
            <Languages className='size-5' aria-hidden />
            <span className='hidden sm:inline'>{languageLabel}</span>
          </button>

          <button
            type='button'
            onClick={onToggleTheme}
            aria-label={t(
              theme === 'dark' ? 'footer.themeToLight' : 'footer.themeToDark'
            )}
            className={cn(
              'border-lp-border text-lp-muted hover:text-lp-text hover:border-lp-brand',
              'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border transition-colors'
            )}
          >
            {theme === 'dark' ? (
              <Sun className='size-5' aria-hidden />
            ) : (
              <Moon className='size-5' aria-hidden />
            )}
          </button>

          <LandingCta
            href='#lista'
            size='compact'
            className='ml-1 hidden md:inline-flex'
            onClick={() => trackEvent('cta_click_header')}
          >
            {t('nav.cta')}
          </LandingCta>
        </div>
      </div>
    </header>
  );
};

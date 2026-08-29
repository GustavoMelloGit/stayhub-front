import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { ROUTES } from '@/routes/routes';

interface LandingFooterProps {
  onSwitchLanguage: () => void;
  languageLabel: string;
}

export const LandingFooter = ({
  onSwitchLanguage,
  languageLabel,
}: LandingFooterProps) => {
  const { t } = useTranslation('landing');

  return (
    <footer className='border-lp-border border-t px-5 py-10 md:px-8 md:py-12'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-lp-text text-xl font-bold'>Sogio</p>
          <p className='text-lp-muted mt-1 text-base'>{t('footer.tagline')}</p>
        </div>

        <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
          <Link
            to={ROUTES.login}
            className='text-lp-muted hover:text-lp-text inline-flex min-h-11 items-center text-base transition-colors'
          >
            {t('footer.login')}
          </Link>
          <button
            type='button'
            onClick={onSwitchLanguage}
            className='text-lp-muted hover:text-lp-text inline-flex min-h-11 items-center text-base transition-colors'
          >
            {languageLabel}
          </button>
        </div>
      </div>

      <p className='text-lp-muted mx-auto mt-8 w-full max-w-6xl text-sm'>
        {t('footer.rights', { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
};

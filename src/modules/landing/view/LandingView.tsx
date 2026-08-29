import { useCallback, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import type { Language } from '@/i18n/language';
import { ROUTES } from '@/routes/routes';
import { setupClarity } from '@/lib/clarity';
import { useLandingTheme } from '../lib/useLandingTheme';
import {
  hasChosenLanguage,
  rememberLanguageChoice,
} from '../lib/languagePreference';
import { useLandingSeo } from '../seo/useLandingSeo';
import { LandingHeader } from '../components/LandingHeader';
import { HeroSection } from '../components/HeroSection';
import { DemoSection } from '../components/DemoSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { AnswersSection } from '../components/AnswersSection';
import { ObjectionsSection } from '../components/ObjectionsSection';
import { FounderSection } from '../components/FounderSection';
import { FaqSection } from '../components/FaqSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { LandingFooter } from '../components/LandingFooter';

interface LandingViewProps {
  /** Idioma que a URL representa: `/` é pt-BR e `/en` é inglês. */
  pageLanguage: Language;
}

const LandingView = ({ pageLanguage }: LandingViewProps) => {
  const { t, language, changeLanguage } = useTranslation('landing');
  const { theme, toggleTheme } = useLandingTheme();
  const navigate = useNavigate();

  // A URL manda no idioma da landing: é o que o `hreflang` e o `canonical`
  // prometem. A exceção é quem *chega* em `/` com o navegador em inglês; em vez
  // de trocar o idioma da pessoa, mandamos para a URL correspondente.
  //
  // Só vale para quem ainda não usou o seletor. Sem essa condição, clicar em
  // "Português" voltaria para `/en`: o `changeLanguage` é assíncrono e o
  // `navigate` para `/` acontece antes de `language` virar `pt`. E a decisão
  // não pode ser memorizada em estado: o React reaproveita esta instância ao ir
  // de `/` para `/en`, e um valor preso em `true` viraria laço de redirect.
  const shouldRedirectToEnglish =
    pageLanguage === 'pt' && language === 'en' && !hasChosenLanguage();

  useEffect(() => {
    if (shouldRedirectToEnglish) return;
    if (language !== pageLanguage) changeLanguage(pageLanguage);
  }, [shouldRedirectToEnglish, language, pageLanguage, changeLanguage]);

  useEffect(() => {
    setupClarity();
  }, []);

  // O `<body>` usa os tokens do app; sem isto o fundo dele aparece no overscroll
  // e nas bordas em telas altas.
  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor =
      theme === 'light' ? 'oklch(0.99 0.004 183)' : 'oklch(0.13 0.012 183)';
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, [theme]);

  useLandingSeo(pageLanguage);

  const switchLanguage = useCallback(() => {
    const next: Language = pageLanguage === 'en' ? 'pt' : 'en';
    rememberLanguageChoice();
    changeLanguage(next);
    navigate(next === 'en' ? ROUTES.landingEn : ROUTES.landing);
  }, [pageLanguage, changeLanguage, navigate]);

  if (shouldRedirectToEnglish) {
    return <Navigate to={ROUTES.landingEn} replace />;
  }

  return (
    <div className='landing min-h-screen' data-lp-theme={theme}>
      <LandingHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        onSwitchLanguage={switchLanguage}
        languageLabel={t('footer.languageSwitch')}
      />

      <main id='conteudo'>
        <HeroSection />
        <DemoSection />
        <HowItWorksSection />
        <AnswersSection />
        <ObjectionsSection />
        <FounderSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <LandingFooter
        onSwitchLanguage={switchLanguage}
        languageLabel={t('footer.languageSwitch')}
      />
    </div>
  );
};

export default LandingView;

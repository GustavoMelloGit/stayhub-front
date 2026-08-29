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
import { FounderSection } from '../components/FounderSection';
import { FaqSection } from '../components/FaqSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { LandingFooter } from '../components/LandingFooter';

interface LandingViewProps {
  /** Idioma que a URL representa: `/` é pt-BR e `/en` é inglês. */
  pageLanguage: Language;
}

const LandingView = ({ pageLanguage }: LandingViewProps) => {
  const { language, changeLanguage } = useTranslation('landing');
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
  //
  // A `theme-color` também é escrita aqui, e não deixada para o
  // `ThemeColorMeta` global: aquele lê o fundo do `body` e roda antes deste
  // efeito, então capturava o fundo do app em vez do da landing.
  //
  // Os valores são hexadecimais, e não os tokens `--lp-bg`, porque
  // `theme-color` em `oklch()` não é lido de forma confiável por todos os
  // navegadores. São o mesmo tom, resolvido para sRGB.
  useEffect(() => {
    const color = theme === 'light' ? '#f9fdfc' : '#030908';
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );

    const previousBackground = document.body.style.backgroundColor;
    const previousMeta = meta?.content;

    document.body.style.backgroundColor = color;
    if (meta) meta.content = color;

    return () => {
      document.body.style.backgroundColor = previousBackground;
      if (meta && previousMeta) meta.content = previousMeta;
    };
  }, [theme]);

  useLandingSeo(pageLanguage);

  const selectLanguage = useCallback(
    (next: Language) => {
      if (next === pageLanguage) return;
      rememberLanguageChoice();
      changeLanguage(next);
      navigate(next === 'en' ? ROUTES.landingEn : ROUTES.landing);
    },
    [pageLanguage, changeLanguage, navigate]
  );

  if (shouldRedirectToEnglish) {
    return <Navigate to={ROUTES.landingEn} replace />;
  }

  return (
    <div className='landing min-h-screen' data-lp-theme={theme}>
      <LandingHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        language={pageLanguage}
        onSelectLanguage={selectLanguage}
      />

      <main id='conteudo'>
        <HeroSection />
        <DemoSection />
        <HowItWorksSection />
        <AnswersSection />
        <FounderSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <LandingFooter
        language={pageLanguage}
        onSelectLanguage={selectLanguage}
      />
    </div>
  );
};

export default LandingView;

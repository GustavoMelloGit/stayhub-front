import type { Language } from '@/i18n/language';
import type { TranslateFn } from '@/i18n/useTranslation';
import { buildStructuredData } from './landingStructuredData';
import type { HeadTags } from './types';

interface LandingHeadInput {
  /** Sem barra final. */
  siteUrl: string;
  language: Language;
  t: TranslateFn;
}

/**
 * Monta o `<head>` da landing a partir das traduções.
 *
 * Recebe `siteUrl` e `t` em vez de importá-los: o build chama esta mesma função
 * em Node, onde não existe `import.meta.env` nem i18next montado.
 */
export const buildLandingHead = ({
  siteUrl,
  language,
  t,
}: LandingHeadInput): HeadTags => {
  const isEnglish = language === 'en';
  const pageUrl = isEnglish ? `${siteUrl}/en` : `${siteUrl}/`;
  const title = t('meta.title');
  const description = t('meta.description');
  // Arte dedicada em 1200x630. O ícone quadrado do PWA continua servindo o
  // `logo` do JSON-LD, mas como card social ele vira miniatura cortada.
  const ogImage = `${siteUrl}/og-cover.png`;

  return {
    title,
    lang: isEnglish ? 'en' : 'pt-BR',
    meta: [
      { key: 'name', value: 'description', content: description },
      { key: 'property', value: 'og:title', content: title },
      { key: 'property', value: 'og:description', content: description },
      { key: 'property', value: 'og:url', content: pageUrl },
      { key: 'property', value: 'og:type', content: 'website' },
      { key: 'property', value: 'og:site_name', content: 'Sogio' },
      {
        key: 'property',
        value: 'og:locale',
        content: isEnglish ? 'en_US' : 'pt_BR',
      },
      { key: 'property', value: 'og:image', content: ogImage },
      { key: 'property', value: 'og:image:width', content: '1200' },
      { key: 'property', value: 'og:image:height', content: '630' },
      { key: 'property', value: 'og:image:type', content: 'image/png' },
      { key: 'property', value: 'og:image:alt', content: 'Sogio' },
      { key: 'name', value: 'twitter:card', content: 'summary_large_image' },
      { key: 'name', value: 'twitter:title', content: title },
      { key: 'name', value: 'twitter:description', content: description },
      { key: 'name', value: 'twitter:image', content: ogImage },
    ],
    links: [
      { rel: 'canonical', href: pageUrl },
      { rel: 'alternate', href: `${siteUrl}/`, hreflang: 'pt-BR' },
      { rel: 'alternate', href: `${siteUrl}/en`, hreflang: 'en' },
      { rel: 'alternate', href: `${siteUrl}/`, hreflang: 'x-default' },
    ],
    jsonLd: buildStructuredData(t, siteUrl, pageUrl, language),
  };
};

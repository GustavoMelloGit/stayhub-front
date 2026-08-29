import { useEffect } from 'react';
import { env } from '@/lib/env';
import { useTranslation } from '@/i18n/useTranslation';
import type { Language } from '@/i18n/language';
import { buildStructuredData } from './structuredData';

const MANAGED_ATTR = 'data-landing-seo';

const siteUrl = env.VITE_SITE_URL.replace(/\/$/, '');

const setMeta = (selector: string, attr: string, value: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    const [attrName, attrValue] = selector
      .replace(/^meta\[|\]$/g, '')
      .split('=');
    tag.setAttribute(attrName, attrValue.replace(/"/g, ''));
    tag.setAttribute(MANAGED_ATTR, '');
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
};

const setLink = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;

  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    if (hreflang) tag.hreflang = hreflang;
    tag.setAttribute(MANAGED_ATTR, '');
    document.head.appendChild(tag);
  }
  tag.href = href;
};

/**
 * Escreve título, descrição, canonical, hreflang e JSON-LD direto no `<head>`.
 *
 * Não usa biblioteca de head porque o build pré-renderiza a página com um
 * navegador de verdade — o que estiver no DOM na hora do snapshot é exatamente
 * o que vai para o HTML estático servido a buscadores e crawlers de IA.
 */
export const useLandingSeo = (language: Language) => {
  const { t } = useTranslation('landing');

  useEffect(() => {
    const pageUrl = language === 'en' ? `${siteUrl}/en` : `${siteUrl}/`;
    const title = t('meta.title');
    const description = t('meta.description');
    // Arte dedicada em 1200x630. O ícone quadrado do PWA continua servindo o
    // `logo` do JSON-LD, mas como card social ele vira miniatura cortada.
    const ogImage = `${siteUrl}/og-cover.png`;

    document.title = title;
    document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[property="og:site_name"]', 'content', 'Sogio');
    setMeta(
      'meta[property="og:locale"]',
      'content',
      language === 'en' ? 'en_US' : 'pt_BR'
    );
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);
    setMeta('meta[property="og:image:width"]', 'content', '1200');
    setMeta('meta[property="og:image:height"]', 'content', '630');
    setMeta('meta[property="og:image:type"]', 'content', 'image/png');
    setMeta('meta[property="og:image:alt"]', 'content', 'Sogio');

    setLink('canonical', pageUrl);
    setLink('alternate', `${siteUrl}/`, 'pt-BR');
    setLink('alternate', `${siteUrl}/en`, 'en');
    setLink('alternate', `${siteUrl}/`, 'x-default');

    const scriptId = 'landing-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(
      buildStructuredData(t, siteUrl, pageUrl)
    );
  }, [language, t]);
};

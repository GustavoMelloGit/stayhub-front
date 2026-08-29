import { useEffect } from 'react';
import { env } from '@/lib/env';

const siteUrl = env.VITE_SITE_URL.replace(/\/$/, '');
const MANAGED = 'data-guide-seo';

interface GuideSeoInput {
  title: string;
  description: string;
  /** Caminho absoluto da página, começando com `/`. */
  path: string;
  /** Ausente na página de índice, que não é um `Article`. */
  article?: { updatedAt: string };
  /** Trilha para o `BreadcrumbList`, do mais raso ao mais profundo. */
  breadcrumb: { name: string; path: string }[];
}

const setMeta = (selector: string, attr: string, value: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    const [name, raw] = selector.replace(/^meta\[|\]$/g, '').split('=');
    tag.setAttribute(name, raw.replace(/"/g, ''));
    tag.setAttribute(MANAGED, '');
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
};

const setCanonical = (href: string) => {
  let tag = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = 'canonical';
    tag.setAttribute(MANAGED, '');
    document.head.appendChild(tag);
  }
  tag.href = href;
};

/**
 * Metadados e JSON-LD das páginas de conteúdo.
 *
 * Escreve direto no `<head>` pelo mesmo motivo da landing: o build
 * pré-renderiza com um navegador de verdade, então o DOM no momento do
 * snapshot é exatamente o que vai para o HTML estático.
 *
 * As páginas existem só em português, então aqui não há `hreflang` — declarar
 * uma alternativa em inglês que não existe é pior do que não declarar nada.
 */
export const useGuideSeo = ({
  title,
  description,
  path,
  article,
  breadcrumb,
}: GuideSeoInput) => {
  useEffect(() => {
    const pageUrl = `${siteUrl}${path}`;
    const ogImage = `${siteUrl}/og-cover.png`;

    document.title = `${title} · Sogio`;
    document.documentElement.lang = 'pt-BR';

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta(
      'meta[property="og:type"]',
      'content',
      article ? 'article' : 'website'
    );
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[property="og:locale"]', 'content', 'pt_BR');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);

    setCanonical(pageUrl);

    // A landing declara alternativas de idioma; um guia herdaria essas tags do
    // HTML estático da raiz se elas não fossem removidas aqui.
    document.head
      .querySelectorAll('link[rel="alternate"]')
      .forEach(node => node.remove());

    const blocks: unknown[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${siteUrl}${crumb.path}`,
        })),
      },
    ];

    if (article) {
      blocks.unshift({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        dateModified: article.updatedAt,
        datePublished: article.updatedAt,
        inLanguage: 'pt-BR',
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        image: ogImage,
        author: { '@type': 'Organization', name: 'Sogio', url: siteUrl },
        publisher: { '@id': `${siteUrl}/#organization` },
      });
    }

    const id = 'guide-structured-data';
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(blocks);
  }, [title, description, path, article, breadcrumb]);
};

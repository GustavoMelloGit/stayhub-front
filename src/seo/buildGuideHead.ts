import { ROUTES } from '@/routes/routes';
import type { HeadTags } from './types';

export interface Crumb {
  name: string;
  /** Caminho absoluto, começando com `/`. */
  path: string;
}

/** Título e descrição do índice, aqui porque o build também precisa deles. */
export const GUIDES_INDEX = {
  title: 'Guias para quem aluga por temporada',
  description:
    'Contas, comparações e rotinas de quem cuida de imóveis de aluguel por temporada, explicadas sem jargão.',
} as const;

const HOME: Crumb = { name: 'Início', path: ROUTES.landing };
const INDEX: Crumb = { name: 'Guias', path: ROUTES.guides };

/** Constante, e não função, para não trocar de identidade a cada render. */
export const GUIDES_INDEX_BREADCRUMB: Crumb[] = [HOME, INDEX];

export const guideBreadcrumb = (slug: string, title: string): Crumb[] => [
  HOME,
  INDEX,
  { name: title, path: ROUTES.guide(slug) },
];

interface GuideHeadInput {
  /** Sem barra final. */
  siteUrl: string;
  title: string;
  description: string;
  /** Caminho absoluto da página, começando com `/`. */
  path: string;
  /** Ausente no índice, que não é um `Article`. */
  article?: { updatedAt: string };
  breadcrumb: Crumb[];
}

/**
 * Monta o `<head>` das páginas de conteúdo.
 *
 * As páginas existem só em português, então não há `hreflang`: declarar uma
 * alternativa em inglês que não existe é pior do que não declarar nada. Como o
 * `<head>` é substituído por inteiro, as alternativas da landing não vazam
 * mais para cá numa navegação pelo cliente.
 */
export const buildGuideHead = ({
  siteUrl,
  title,
  description,
  path,
  article,
  breadcrumb,
}: GuideHeadInput): HeadTags => {
  const pageUrl = `${siteUrl}${path}`;
  const ogImage = `${siteUrl}/og-cover.png`;
  const pageTitle = `${title} · Sogio`;

  const jsonLd: unknown[] = [];

  if (article) {
    jsonLd.push({
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

  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  });

  return {
    title: pageTitle,
    lang: 'pt-BR',
    meta: [
      { key: 'name', value: 'description', content: description },
      { key: 'property', value: 'og:title', content: pageTitle },
      { key: 'property', value: 'og:description', content: description },
      { key: 'property', value: 'og:url', content: pageUrl },
      {
        key: 'property',
        value: 'og:type',
        content: article ? 'article' : 'website',
      },
      { key: 'property', value: 'og:site_name', content: 'Sogio' },
      { key: 'property', value: 'og:locale', content: 'pt_BR' },
      { key: 'property', value: 'og:image', content: ogImage },
      { key: 'name', value: 'twitter:card', content: 'summary_large_image' },
      { key: 'name', value: 'twitter:title', content: pageTitle },
      { key: 'name', value: 'twitter:description', content: description },
      { key: 'name', value: 'twitter:image', content: ogImage },
    ],
    links: [{ rel: 'canonical', href: pageUrl }],
    jsonLd,
  };
};

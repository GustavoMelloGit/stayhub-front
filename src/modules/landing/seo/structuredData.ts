import type { TranslateFn } from '@/i18n/useTranslation';

export const FAQ_ITEM_KEYS = [
  'item1',
  'item2',
  'item3',
  'item4',
  'item5',
  'item6',
  'item7',
  'item8',
] as const;

/**
 * JSON-LD da landing.
 *
 * `Organization` e `SoftwareApplication` dão a um assistente de IA o nome, a
 * categoria e o público do produto; `FAQPage` entrega perguntas e respostas já
 * pareadas, que é o formato que esses modelos citam com mais facilidade.
 */
export const buildStructuredData = (
  t: TranslateFn,
  siteUrl: string,
  pageUrl: string
) => [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Sogio',
    url: siteUrl,
    logo: `${siteUrl}/web-app-manifest-512x512.png`,
    description: t('meta.description'),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sogio',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    url: pageUrl,
    description: t('meta.description'),
    publisher: { '@id': `${siteUrl}/#organization` },
    audience: {
      '@type': 'Audience',
      audienceType: t('answers.eyebrow'),
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEM_KEYS.map(item => ({
      '@type': 'Question',
      name: t(`faq.${item}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.${item}.answer`),
      },
    })),
  },
];

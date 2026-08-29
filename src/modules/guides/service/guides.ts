import type { GuideModule } from '../../../../plugins/vite-plugin-markdown';

/**
 * Registro dos guias.
 *
 * O glob é `eager` porque o índice precisa dos metadados de todos e o volume é
 * texto: alguns KB comprimidos. Este módulo só é importado pelas rotas de
 * `/guias`, que são lazy, então nada disso entra no bundle da landing.
 */
const modules = import.meta.glob<{ default: GuideModule }>(
  '/src/content/guides/*.md',
  { eager: true }
);

export const GUIDES: GuideModule[] = Object.values(modules)
  .map(module => module.default)
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

export const findGuide = (slug: string | undefined): GuideModule | undefined =>
  GUIDES.find(guide => guide.slug === slug);

/**
 * Ponto de entrada consumido por `scripts/prerender.mjs`.
 *
 * O script roda em Node puro, que não lê TypeScript nem o alias `@`. O passo
 * `build:seo` compila este arquivo com o próprio Vite, que já resolve as duas
 * coisas, e o resultado é importado pelo prerender. É o que mantém build e
 * navegador consumindo exatamente os mesmos builders.
 */
export { buildLandingHead } from './buildLandingHead';
export {
  buildGuideHead,
  guideBreadcrumb,
  GUIDES_INDEX_BREADCRUMB,
  GUIDES_INDEX,
} from './buildGuideHead';
export { renderHead } from './renderHead';
export { MANAGED_ATTR, JSON_LD_ID } from './types';
export type { HeadTags } from './types';

/**
 * Descrição declarativa do `<head>` de uma página pública.
 *
 * Este módulo é a fonte única do SEO: o navegador o aplica ao DOM em
 * `applyHead`, e o build o serializa em HTML em `renderHead`. Nenhum dos dois
 * decide conteúdo — os dois consomem o mesmo objeto.
 */

/** Uma `<meta>`, identificada pelo atributo que a torna única no `<head>`. */
export interface MetaTag {
  /** `name` ou `property`, conforme o vocabulário da tag. */
  key: 'name' | 'property';
  value: string;
  content: string;
}

export interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
}

export interface HeadTags {
  title: string;
  /** Valor de `<html lang>`. */
  lang: string;
  meta: MetaTag[];
  links: LinkTag[];
  /** Blocos JSON-LD, serializados juntos em um único `<script>`. */
  jsonLd: unknown[];
}

/** Marca as tags que o SEO controla, para poder substituí-las por inteiro. */
export const MANAGED_ATTR = 'data-seo';

/** `id` do `<script type="application/ld+json">` gerado. */
export const JSON_LD_ID = 'seo-structured-data';

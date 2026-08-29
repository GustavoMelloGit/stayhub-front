import { marked } from 'marked';
import type { Plugin } from 'vite';

/**
 * Converte `.md` em módulo JS durante o build.
 *
 * A conversão acontece no Node, então `marked` fica só no `devDependencies` e
 * o cliente recebe apenas a string de HTML já pronta. Importar o Markdown como
 * `?raw` e converter em runtime custaria uma biblioteca de parsing no bundle
 * de uma página cujo conteúdo nunca muda depois do build.
 */

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  /** Data ISO da última revisão, usada no `Article` e no sitemap. */
  updatedAt: string;
  /** Consulta principal que a página persegue, para conferência futura. */
  query: string;
}

export interface GuideModule extends GuideMeta {
  html: string;
  /** Minutos estimados de leitura, a 200 palavras por minuto. */
  readingMinutes: number;
}

const REQUIRED: (keyof GuideMeta)[] = [
  'slug',
  'title',
  'description',
  'updatedAt',
  'query',
];

/**
 * Frontmatter mínimo: uma chave por linha, valor em texto puro. Não usa YAML
 * de verdade porque o formato é nosso e uma dependência a mais só para ler
 * `chave: valor` não se paga.
 */
const parseFrontmatter = (source: string, id: string) => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) {
    throw new Error(`[markdown] ${id} não tem bloco de frontmatter.`);
  }

  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const separator = line.indexOf(':');
    if (separator === -1) {
      throw new Error(
        `[markdown] ${id}: linha de frontmatter inválida "${line}".`
      );
    }
    meta[line.slice(0, separator).trim()] = line
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
  }

  const missing = REQUIRED.filter(key => !meta[key]);
  if (missing.length) {
    throw new Error(
      `[markdown] ${id}: faltam as chaves ${missing.join(', ')}.`
    );
  }

  return { meta, body: source.slice(match[0].length) };
};

export const markdown = (): Plugin => ({
  name: 'sogio-markdown',
  enforce: 'pre',

  transform(source, id) {
    if (!id.endsWith('.md')) return null;

    const { meta, body } = parseFrontmatter(source, id);
    const html = marked.parse(body, { async: false, gfm: true });
    const words = body.split(/\s+/).filter(Boolean).length;

    const moduleValue: GuideModule = {
      slug: meta.slug,
      title: meta.title,
      description: meta.description,
      updatedAt: meta.updatedAt,
      query: meta.query,
      readingMinutes: Math.max(1, Math.round(words / 200)),
      html,
    };

    return {
      code: `export default ${JSON.stringify(moduleValue)};`,
      map: null,
    };
  },
});

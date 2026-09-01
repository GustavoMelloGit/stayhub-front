import { JSON_LD_ID, MANAGED_ATTR } from './types';
import type { HeadTags } from './types';

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeText = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Serializa o `<head>` em HTML, para o build escrever no arquivo estático.
 *
 * É o par de `applyHead`: mesma entrada, mesmo resultado, um no DOM e outro em
 * texto. O que buscadores leem sai daqui, não do que o React montou.
 */
export const renderHead = (head: HeadTags): string => {
  const lines = [`<title ${MANAGED_ATTR}>${escapeText(head.title)}</title>`];

  for (const meta of head.meta) {
    lines.push(
      `<meta ${MANAGED_ATTR} ${meta.key}="${escapeAttribute(meta.value)}" content="${escapeAttribute(meta.content)}" />`
    );
  }

  for (const link of head.links) {
    const hreflang = link.hreflang
      ? ` hreflang="${escapeAttribute(link.hreflang)}"`
      : '';
    lines.push(
      `<link ${MANAGED_ATTR} rel="${escapeAttribute(link.rel)}"${hreflang} href="${escapeAttribute(link.href)}" />`
    );
  }

  // `<` vira escape unicode para que nenhum valor possa fechar o `<script>`.
  const jsonLd = JSON.stringify(head.jsonLd).replace(/</g, '\\u003c');
  lines.push(
    `<script ${MANAGED_ATTR} id="${JSON_LD_ID}" type="application/ld+json">${jsonLd}</script>`
  );

  return lines.join('\n    ');
};

import { JSON_LD_ID, MANAGED_ATTR } from './types';
import type { HeadTags, LinkTag, MetaTag } from './types';

const metaSelector = (tag: MetaTag) => `meta[${tag.key}="${tag.value}"]`;

const linkSelector = (tag: LinkTag) =>
  tag.hreflang
    ? `link[rel="${tag.rel}"][hreflang="${tag.hreflang}"]`
    : `link[rel="${tag.rel}"]:not([hreflang])`;

/**
 * Sincroniza o `<head>` do documento com a descrição vinda dos builders.
 *
 * Só existe para a navegação pelo cliente: o HTML servido a buscadores já sai
 * do build com estas mesmas tags, geradas por `renderHead` a partir do mesmo
 * objeto. Aqui não se decide conteúdo — só se aplica.
 *
 * Tudo que passa por aqui fica marcado com `data-seo`, e o que estava marcado
 * e não aparece mais no conjunto é removido. É essa substituição por inteiro
 * que impede uma página de herdar tag de outra numa navegação.
 */
export const applyHead = (head: HeadTags) => {
  const kept = new Set<Element>();

  const adopt = (selector: string, create: () => Element) => {
    const existing = document.head.querySelector(selector);
    const tag = existing ?? create();
    tag.setAttribute(MANAGED_ATTR, '');
    if (!existing) document.head.appendChild(tag);
    kept.add(tag);
    return tag;
  };

  for (const meta of head.meta) {
    const tag = adopt(metaSelector(meta), () => {
      const created = document.createElement('meta');
      created.setAttribute(meta.key, meta.value);
      return created;
    });
    tag.setAttribute('content', meta.content);
  }

  for (const link of head.links) {
    const tag = adopt(linkSelector(link), () => {
      const created = document.createElement('link');
      created.setAttribute('rel', link.rel);
      if (link.hreflang) created.setAttribute('hreflang', link.hreflang);
      return created;
    });
    tag.setAttribute('href', link.href);
  }

  const script = adopt(`script#${JSON_LD_ID}`, () => {
    const created = document.createElement('script');
    created.id = JSON_LD_ID;
    created.setAttribute('type', 'application/ld+json');
    return created;
  });
  script.textContent = JSON.stringify(head.jsonLd);

  document.head.querySelectorAll(`[${MANAGED_ATTR}]`).forEach(tag => {
    if (!kept.has(tag)) tag.remove();
  });

  document.title = head.title;
  document.documentElement.lang = head.lang;

  // Só o JSON-LD sai ao desmontar. Ele afirma coisas sobre o conteúdo da
  // página — um `FAQPage` sobrevivente descreveria perguntas que a próxima
  // tela não mostra. As `meta` restantes são apenas desatualizadas, e a
  // próxima página que aplicar um `<head>` as reescreve.
  return () => script.remove();
};

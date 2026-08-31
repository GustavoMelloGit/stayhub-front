/**
 * A landing anima em dois lugares apenas: o herói e a demonstração de conversa.
 * Tudo passa por aqui para que exista um único ponto que decide se animar é
 * permitido.
 *
 * O script de pré-renderização (`scripts/prerender.mjs`) roda o navegador com
 * `prefers-reduced-motion: reduce`, então esta mesma checagem faz o HTML
 * estático sair com todo o conteúdo em seu estado final — que é o que os
 * buscadores e os crawlers de IA leem.
 */
export const canAnimate = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  if (typeof IntersectionObserver === 'undefined') return false;

  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

import { env } from './env';

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

let injected = false;

/**
 * Carrega o Microsoft Clarity. Só injeta o script se `VITE_CLARITY_ID` estiver
 * definida, para que ambientes locais e o navegador que pré-renderiza a página
 * no build não gerem sessões falsas.
 */
export const setupClarity = (): void => {
  if (injected) return;
  if (typeof document === 'undefined') return;

  const projectId = env.VITE_CLARITY_ID;
  if (!projectId) return;

  injected = true;

  // A fila é o que o snippet oficial instala antes de baixar o script: sem ela
  // um evento disparado nos primeiros instantes da página (um clique no CTA do
  // herói, por exemplo) cairia num `window.clarity` ainda indefinido e sumiria.
  // O `clarity.js` consome `clarity.q` ao inicializar.
  if (!window.clarity) {
    const queue: ClarityFn = (...args: unknown[]) => {
      queue.q = queue.q ?? [];
      queue.q.push(args);
    };
    window.clarity = queue;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
};

/**
 * Eventos de decisão da landing. `form_abandon` inclui o campo em que a pessoa
 * parou — sem isso não dá para saber se pedir o WhatsApp está derrubando a
 * conversão, que é a hipótese mais provável num público 50+.
 */
export type LandingEvent =
  | 'cta_click_hero'
  | 'cta_click_final'
  | 'cta_click_header'
  | 'demo_watched'
  | 'objections_reached'
  | 'form_start'
  | 'form_submit'
  | 'form_abandon';

export const trackEvent = (
  event: LandingEvent,
  detail?: Record<string, string>
): void => {
  const clarity = typeof window !== 'undefined' ? window.clarity : undefined;
  if (!clarity) return;

  clarity('event', event);

  if (detail) {
    Object.entries(detail).forEach(([key, value]) => {
      clarity('set', `${event}_${key}`, value);
    });
  }
};

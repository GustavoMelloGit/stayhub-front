import { env } from './env';

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

let injected = false;

/**
 * Só o domínio de produção conta.
 *
 * Compara com o host de `VITE_SITE_URL` em vez de olhar apenas
 * `import.meta.env.PROD`, porque um build de produção também é o que roda em
 * `npm run preview`, nos previews da Vercel e no navegador que pré-renderiza
 * a página. Nenhum desses é gente de verdade, e todos sujariam as métricas.
 *
 * O `www.` é ignorado dos dois lados: o mesmo site atendido com e sem o
 * prefixo continua sendo produção.
 */
const isProductionHost = (): boolean => {
  const semWww = (host: string) => host.replace(/^www\./, '');

  try {
    return (
      semWww(window.location.hostname) ===
      semWww(new URL(env.VITE_SITE_URL).hostname)
    );
  } catch {
    return false;
  }
};

/**
 * Carrega o Microsoft Clarity. Exige `VITE_CLARITY_ID` definida e o domínio de
 * produção: desenvolvimento, preview e pré-renderização ficam de fora para não
 * poluir os dados com sessões que não são de usuários.
 */
export const setupClarity = (): void => {
  if (injected) return;
  if (typeof document === 'undefined') return;
  if (!isProductionHost()) return;

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
 * parou: sem isso não dá para saber se pedir o WhatsApp está derrubando a
 * conversão, que é a hipótese mais provável num público 50+. `faq_reached`
 * marca quem desceu até as objeções, o sinal mais forte de intenção da página.
 */
export type LandingEvent =
  | 'cta_click_hero'
  | 'cta_click_final'
  | 'cta_click_header'
  | 'demo_watched'
  | 'faq_reached'
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

import { z } from 'zod';

/**
 * Schema de validação para variáveis de ambiente
 * Define apenas a variável VITE_API_URL necessária
 */
const envSchema = z.object({
  VITE_API_URL: z.url().default('http://localhost:3030'),
  /** URL pública do site, usada nos canonical/hreflang e no sitemap. */
  VITE_SITE_URL: z.url().default('https://www.sogio.app'),
  /** Project ID do Microsoft Clarity. Vazio desliga o analytics. */
  VITE_CLARITY_ID: z.string().trim().optional(),
  /**
   * Token do Google Search Console. Só o conteúdo, sem a tag: a meta é
   * escrita no `index.html` durante o build e entra no HTML pré-renderizado.
   */
  VITE_GSC_VERIFICATION: z.string().trim().optional(),
});

/**
 * Tipo inferido das variáveis de ambiente validadas
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Valida e retorna as variáveis de ambiente com type-safety
 * Lança erro se a variável obrigatória estiver ausente ou inválida
 */
function validateEnv(): Env {
  try {
    return envSchema.parse({
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
      VITE_CLARITY_ID: import.meta.env.VITE_CLARITY_ID,
      VITE_GSC_VERIFICATION: import.meta.env.VITE_GSC_VERIFICATION,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`
      );

      throw new Error(
        `❌ Variáveis de ambiente inválidas:\n${errorMessages.join('\n')}\n\n` +
          'Verifique o arquivo .env e certifique-se de que VITE_API_URL está definida.'
      );
    }
    throw error;
  }
}

/**
 * Instância validada das variáveis de ambiente
 * Disponível globalmente na aplicação com type-safety completo
 */
export const env = validateEnv();

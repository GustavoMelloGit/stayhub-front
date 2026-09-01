import { useEffect } from 'react';
import { env } from '@/lib/env';
import { useTranslation } from '@/i18n/useTranslation';
import type { Language } from '@/i18n/language';
import { applyHead } from '@/seo/applyHead';
import { buildLandingHead } from '@/seo/buildLandingHead';

const siteUrl = env.VITE_SITE_URL.replace(/\/$/, '');

/**
 * Aplica o `<head>` da landing durante a navegação pelo cliente.
 *
 * O conteúdo vem de `buildLandingHead`, o mesmo builder que o build usa para
 * escrever o HTML estático. Este hook não decide nada — se uma tag estiver
 * errada no resultado da busca, o lugar de corrigir é o builder.
 */
export const useLandingSeo = (language: Language) => {
  const { t } = useTranslation('landing');

  useEffect(
    () => applyHead(buildLandingHead({ siteUrl, language, t })),
    [language, t]
  );
};

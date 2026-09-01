import { useEffect } from 'react';
import { env } from '@/lib/env';
import { applyHead } from '@/seo/applyHead';
import { buildGuideHead } from '@/seo/buildGuideHead';
import type { Crumb } from '@/seo/buildGuideHead';

const siteUrl = env.VITE_SITE_URL.replace(/\/$/, '');

interface GuideSeoInput {
  title: string;
  description: string;
  /** Caminho absoluto da página, começando com `/`. */
  path: string;
  /** Ausente na página de índice, que não é um `Article`. */
  article?: { updatedAt: string };
  /** Trilha para o `BreadcrumbList`, do mais raso ao mais profundo. */
  breadcrumb: Crumb[];
}

/**
 * Aplica o `<head>` das páginas de conteúdo durante a navegação pelo cliente.
 *
 * Par do `useLandingSeo`: o conteúdo vem de `buildGuideHead`, que o build
 * também chama para gerar o HTML estático.
 */
export const useGuideSeo = ({
  title,
  description,
  path,
  article,
  breadcrumb,
}: GuideSeoInput) => {
  useEffect(
    () =>
      applyHead(
        buildGuideHead({
          siteUrl,
          title,
          description,
          path,
          article,
          breadcrumb,
        })
      ),
    [title, description, path, article, breadcrumb]
  );
};

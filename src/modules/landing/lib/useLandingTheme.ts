import { useCallback, useEffect, useState } from 'react';

export type LandingTheme = 'dark' | 'light';

const STORAGE_KEY = 'sogio_landing_theme';

/**
 * Tema da landing, independente do tema do app.
 *
 * O padrão é escuro de propósito — é a única metade da paleta do Sogio que
 * carrega cor de marca. O claro existe como alternativa real, e não decorativa,
 * porque parte do público tem 50+ anos e astigmatismo faz texto claro sobre
 * fundo escuro borrar.
 */
export const useLandingTheme = () => {
  const [theme, setTheme] = useState<LandingTheme>('dark');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') setTheme(stored);
    } catch {
      // Navegação privada ou cookies bloqueados: mantém o padrão escuro.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next: LandingTheme = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Sem persistência disponível; a troca vale só para esta sessão.
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
};

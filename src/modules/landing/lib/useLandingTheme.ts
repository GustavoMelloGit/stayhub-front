import { useCallback, useEffect, useState } from 'react';

export type LandingTheme = 'dark' | 'light';

const STORAGE_KEY = 'sogio_landing_theme';

/**
 * Tema da landing, independente do tema do app.
 *
 * O padrão é claro. Além de ser a preferência do produto, é o que a evidência
 * recomenda para este público: polaridade positiva rende melhor acuidade de
 * leitura, e acima dos 50 anos a pupila é menor e o cristalino espalha mais
 * luz. O escuro continua disponível pelo seletor do cabeçalho.
 */
export const useLandingTheme = () => {
  const [theme, setTheme] = useState<LandingTheme>('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') setTheme(stored);
    } catch {
      // Navegação privada ou cookies bloqueados: mantém o padrão claro.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next: LandingTheme = current === 'light' ? 'dark' : 'light';
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

import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Configuração do QueryClient para TanStack Query
 * Define configurações padrão para cache, retry e stale time
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error: unknown) => {
        if (!axios.isAxiosError(error)) return false;
        const status = error?.response?.status;

        // Não tenta novamente para erros 4xx
        if (status && status >= 400 && status < 500) {
          return false;
        }

        // Tenta até 3 vezes para outros erros
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '@/modules/auth/service/AuthService';
import { ROUTES } from '@/routes/routes';

interface LandingRouteProps {
  children: React.ReactNode;
}

/**
 * Guarda da landing page pública.
 *
 * Usa a checagem síncrona de token em vez de `useAuthData` de propósito: a
 * landing é a rota mais visitada por gente anônima e não deve disparar nenhuma
 * request de autenticação nem exibir spinner antes do primeiro pixel. Quem já
 * tem sessão vai direto para o app.
 */
export const LandingRoute: React.FC<LandingRouteProps> = ({ children }) => {
  if (AuthService.isAuthenticated()) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <>{children}</>;
};

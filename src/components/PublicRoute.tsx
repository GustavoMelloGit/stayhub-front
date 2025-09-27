import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthData } from '@/modules/auth/service/AuthService.hooks';
import { AuthLoadingSpinner } from './AuthLoadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rotas públicas (login/signup)
 * Redireciona usuários já autenticados para a página inicial
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthData();
  const location = useLocation();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Se estiver autenticado, redireciona para a página inicial ou para onde estava tentando ir
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Se não autenticado, renderiza o conteúdo público
  return <>{children}</>;
};

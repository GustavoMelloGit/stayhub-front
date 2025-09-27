import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthData } from '@/modules/auth/service/AuthService.hooks';
import { AuthLoadingSpinner } from './AuthLoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona usuários não autenticados para a página de login
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthData();
  const location = useLocation();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Se autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
};

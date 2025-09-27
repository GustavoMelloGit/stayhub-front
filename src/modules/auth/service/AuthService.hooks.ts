import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../service/AuthService';
import {
  type AuthResponse,
  type LoginCredentials,
  type SignupRequest,
} from '../types/AuthTypes';

/**
 * Hook para obter dados de autenticação
 * Fornece dados do usuário e estado de autenticação
 */
export const useAuthData = () => {
  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: () => AuthService.getAuthData(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    user: authData?.user || null,
    token: authData?.token || null,
    isAuthenticated: !!authData,
    isLoading,
  };
};

/**
 * Hook para realizar login de usuário
 * Fornece função de login e estados relacionados
 */
export const useSignin = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      AuthService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      AuthService.saveAuthData(data);
      queryClient.setQueryData(['auth'], data);
    },
  });

  return {
    signin: loginMutation.mutate,
    isSigninLoading: loginMutation.isPending,
    signinError: loginMutation.error,
  };
};

/**
 * Hook para realizar cadastro de usuário
 * Fornece função de signup e estados relacionados
 */
export const useSignup = () => {
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: (credentials: SignupRequest) => AuthService.signup(credentials),
    onSuccess: (data: AuthResponse) => {
      AuthService.saveAuthData(data);
      queryClient.setQueryData(['auth'], data);
    },
  });

  return {
    signup: signupMutation.mutate,
    isSignupLoading: signupMutation.isPending,
    signupError: signupMutation.error,
  };
};

/**
 * Hook para realizar logout
 * Fornece função de logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    AuthService.logout();
    queryClient.setQueryData(['auth'], null);
  };

  return { logout };
};

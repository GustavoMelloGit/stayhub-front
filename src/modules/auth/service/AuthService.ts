import api from '@/lib/api';
import type {
  AuthResponse,
  LoginCredentials,
  SignupRequest,
} from '../types/AuthTypes';

/**
 * Serviço responsável por operações de autenticação
 * Gerencia login, registro e logout de usuários
 */
export class AuthService {
  /**
   * Realiza login do usuário
   * @param credentials - Credenciais de login (email e senha)
   * @returns Promise com dados do usuário e token de autenticação
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/sign-in', credentials);
    return response.data;
  }

  /**
   * Registra um novo usuário
   * @param credentials - Dados de registro do usuário
   * @returns Promise com dados do usuário e token de autenticação
   */
  static async signup(credentials: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/users', credentials);
    return response.data;
  }

  /**
   * Realiza logout do usuário
   * Remove token do localStorage
   */
  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  /**
   * Salva dados de autenticação no localStorage
   * @param authData - Dados de autenticação (usuário e token)
   */
  static saveAuthData(authData: AuthResponse): void {
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user_data', JSON.stringify(authData.user));
  }

  /**
   * Recupera dados de autenticação do localStorage
   * @returns Dados de autenticação ou null se não encontrados
   */
  static getAuthData(): AuthResponse | null {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (!token || !userData) {
      return null;
    }

    try {
      const user = JSON.parse(userData);
      return { user, token };
    } catch {
      return null;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns true se autenticado, false caso contrário
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

import api from '@/lib/api';
import type {
  AuthResponse,
  LoginCredentials,
  SignupRequest,
  User,
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
  static async getAuthData(): Promise<User | null> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns true se autenticado, false caso contrário
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

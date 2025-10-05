import axios from 'axios';
import { env } from './env';

/**
 * Configuração base do Axios para a aplicação StayHub
 * Define interceptors, base URL e configurações padrão
 */
const api = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para requisições - adiciona token de autenticação se disponível
 */
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para respostas - trata erros globais
 */
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

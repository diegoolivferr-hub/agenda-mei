import { apiRequest, authStorage } from './api';
import type { User } from '@/app/App';

export interface LoginResponse {
  mensagem: string;
  user: User;
  token: string;
}

export interface RegisterData {
  nome: string;
  cnpj: string;
  areaAtuacao: string;
  login: string;
  senha: string;
}

export const authService = {
  async login(login: string, senha: string): Promise<LoginResponse> {
    const res = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, senha }),
    });

    if (res.token) {
      authStorage.setToken(res.token);
    }

    return res;
  },

  async register(dados: RegisterData): Promise<LoginResponse> {
    const res = await apiRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(dados),
    });

    if (res.token) {
      authStorage.setToken(res.token);
    }

    return res;
  },

  async getProfile(): Promise<User> {
    return apiRequest<User>('/users/profile');
  },

  async updateProfile(dados: Partial<User>): Promise<{ mensagem: string; user: User }> {
    return apiRequest<{ mensagem: string; user: User }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  logout(): void {
    authStorage.removeToken();
  },
};

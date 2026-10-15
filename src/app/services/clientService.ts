import { apiRequest } from './api';
import type { Cliente } from '@/app/components/Clientes';

export const clientService = {
  async list(busca?: string): Promise<Cliente[]> {
    const query = busca ? `?busca=${encodeURIComponent(busca)}` : '';
    return apiRequest<Cliente[]>(`/clients${query}`);
  },

  async getById(id: number): Promise<Cliente> {
    return apiRequest<Cliente>(`/clients/${id}`);
  },

  async create(dados: Omit<Cliente, 'id'>): Promise<{ mensagem: string; cliente: Cliente }> {
    return apiRequest<{ mensagem: string; cliente: Cliente }>('/clients', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  async update(
    id: number,
    dados: Partial<Omit<Cliente, 'id'>>
  ): Promise<{ mensagem: string; cliente: Cliente }> {
    return apiRequest<{ mensagem: string; cliente: Cliente }>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  async delete(id: number): Promise<{ mensagem: string }> {
    return apiRequest<{ mensagem: string }>(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

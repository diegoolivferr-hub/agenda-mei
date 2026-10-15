import { apiRequest } from './api';

export interface ServicoItem {
  id: number;
  descricao: string;
  preco: number;
  disponivel: boolean;
  categoria: string;
  observacoes?: string;
}

export const serviceService = {
  async list(busca?: string): Promise<ServicoItem[]> {
    const query = busca ? `?busca=${encodeURIComponent(busca)}` : '';
    return apiRequest<ServicoItem[]>(`/services${query}`);
  },

  async getById(id: number): Promise<ServicoItem> {
    return apiRequest<ServicoItem>(`/services/${id}`);
  },

  async create(dados: Omit<ServicoItem, 'id'>): Promise<{ mensagem: string; servico: ServicoItem }> {
    return apiRequest<{ mensagem: string; servico: ServicoItem }>('/services', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  async update(
    id: number,
    dados: Partial<Omit<ServicoItem, 'id'>>
  ): Promise<{ mensagem: string; servico: ServicoItem }> {
    return apiRequest<{ mensagem: string; servico: ServicoItem }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  async delete(id: number): Promise<{ mensagem: string }> {
    return apiRequest<{ mensagem: string }>(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

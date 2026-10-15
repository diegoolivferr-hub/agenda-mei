import { apiRequest } from './api';

export interface CompromissoItem {
  id: number;
  clienteId: number;
  clienteNome?: string;
  servicoId: number;
  servicoNome?: string;
  data: string;
  hora: string;
  status: 'agendado' | 'cumprido' | 'naoCumprido';
  justificativa?: string;
}

export const appointmentService = {
  async list(filters?: {
    status?: string;
    data?: string;
    clienteId?: number;
  }): Promise<CompromissoItem[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.data) params.append('data', filters.data);
    if (filters?.clienteId) params.append('clienteId', filters.clienteId.toString());

    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<CompromissoItem[]>(`/appointments${qs}`);
  },

  async getById(id: number): Promise<CompromissoItem> {
    return apiRequest<CompromissoItem>(`/appointments/${id}`);
  },

  async create(dados: {
    clienteId: number;
    servicoId: number;
    data: string;
    hora: string;
    status?: 'agendado' | 'cumprido' | 'naoCumprido';
    justificativa?: string;
  }): Promise<{ mensagem: string; agendamento: CompromissoItem }> {
    return apiRequest<{ mensagem: string; agendamento: CompromissoItem }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  async update(
    id: number,
    dados: Partial<{
      clienteId: number;
      servicoId: number;
      data: string;
      hora: string;
      status: 'agendado' | 'cumprido' | 'naoCumprido';
      justificativa: string;
    }>
  ): Promise<{ mensagem: string; agendamento: CompromissoItem }> {
    return apiRequest<{ mensagem: string; agendamento: CompromissoItem }>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  async updateStatus(
    id: number,
    status: 'agendado' | 'cumprido' | 'naoCumprido',
    justificativa?: string
  ): Promise<{ mensagem: string; agendamento: CompromissoItem }> {
    return apiRequest<{ mensagem: string; agendamento: CompromissoItem }>(
      `/appointments/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, justificativa }),
      }
    );
  },

  async delete(id: number): Promise<{ mensagem: string }> {
    return apiRequest<{ mensagem: string }>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};

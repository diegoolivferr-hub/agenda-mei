/**
 * Camada de comunicação HTTP com a API REST do Agenda-MEI
 */

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const TOKEN_KEY = 'agendaMeiToken';

export const authStorage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export class ApiError extends Error {
  statusCode: number;
  detalhes?: any;

  constructor(message: string, statusCode: number, detalhes?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }
}

/**
 * Utilitário de requisição HTTP com injeção automática de Bearer Token e cabeçalhos
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authStorage.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o back-end está ativo.',
      0
    );
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMsg =
      data?.erro ||
      data?.mensagem ||
      `Falha na requisição: ${response.status} ${response.statusText}`;
    throw new ApiError(errorMsg, response.status, data?.detalhes);
  }

  return data as T;
}

export interface User {
  id: string;
  nome: string;
  cnpj: string;
  areaAtuacao: string;
  login: string;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  nomeEmpresa?: string | null;
  fotoPerfil?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRow {
  id: string;
  nome: string;
  cnpj: string;
  area_atuacao: string;
  login: string;
  password_hash: string;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  nome_empresa: string | null;
  foto_perfil: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Client {
  id: number;
  userId: string;
  nome: string;
  telefone: string;
  email?: string | null;
  observacoes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientRow {
  id: number;
  user_id: string;
  nome: string;
  telefone: string;
  email: string | null;
  observacoes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Service {
  id: number;
  userId: string;
  descricao: string;
  preco: number;
  disponivel: boolean;
  categoria: string;
  observacoes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceRow {
  id: number;
  user_id: string;
  descricao: string;
  preco: string | number;
  disponivel: boolean;
  categoria: string;
  observacoes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Appointment {
  id: number;
  userId: string;
  clienteId: number;
  clienteNome?: string;
  servicoId: number;
  servicoNome?: string;
  data: string;
  hora: string;
  status: 'agendado' | 'cumprido' | 'naoCumprido';
  justificativa?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppointmentRow {
  id: number;
  user_id: string;
  cliente_id: number;
  cliente_nome?: string;
  servico_id: number;
  servico_nome?: string;
  data: string | Date;
  hora: string;
  status: 'agendado' | 'cumprido' | 'naoCumprido';
  justificativa: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface TokenPayload {
  userId: string;
  login: string;
}

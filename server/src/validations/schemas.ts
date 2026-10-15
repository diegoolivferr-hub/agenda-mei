import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    cnpj: z.string().min(14, 'CNPJ inválido ou incompleto'),
    areaAtuacao: z.string().min(2, 'Informe a área de atuação'),
    login: z.string().min(3, 'O login deve ter pelo menos 3 caracteres'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    login: z.string().min(1, 'Informe o login'),
    senha: z.string().min(1, 'Informe a senha'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    nome: z.string().min(2).optional(),
    cnpj: z.string().min(14).optional(),
    areaAtuacao: z.string().min(2).optional(),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    telefone: z.string().optional(),
    endereco: z.string().optional(),
    nomeEmpresa: z.string().optional(),
    fotoPerfil: z.string().optional(),
  }),
});

export const createClientSchema = z.object({
  body: z.object({
    nome: z.string().min(2, 'Nome é obrigatório e deve ter ao menos 2 caracteres'),
    telefone: z.string().min(8, 'Telefone é obrigatório'),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    observacoes: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID do cliente deve ser numérico'),
  }),
  body: z.object({
    nome: z.string().min(2).optional(),
    telefone: z.string().min(8).optional(),
    email: z.string().email().optional().or(z.literal('')),
    observacoes: z.string().optional(),
  }),
});

export const createServiceSchema = z.object({
  body: z.object({
    descricao: z.string().min(2, 'Descrição do serviço é obrigatória'),
    preco: z.coerce.number().min(0, 'O preço deve ser maior ou igual a zero'),
    disponivel: z.boolean().default(true),
    categoria: z.string().min(2, 'Categoria é obrigatória'),
    observacoes: z.string().optional(),
  }),
});

export const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID do serviço deve ser numérico'),
  }),
  body: z.object({
    descricao: z.string().min(2).optional(),
    preco: z.coerce.number().min(0).optional(),
    disponivel: z.boolean().optional(),
    categoria: z.string().min(2).optional(),
    observacoes: z.string().optional(),
  }),
});

export const createAppointmentSchema = z.object({
  body: z.object({
    clienteId: z.coerce.number().int().positive('Cliente inválido'),
    servicoId: z.coerce.number().int().positive('Serviço inválido'),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data deve ser AAAA-MM-DD'),
    hora: z.string().min(4, 'Horário é obrigatório'),
    status: z.enum(['agendado', 'cumprido', 'naoCumprido']).default('agendado'),
    justificativa: z.string().optional(),
  }),
});

export const updateAppointmentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID do agendamento deve ser numérico'),
  }),
  body: z.object({
    clienteId: z.coerce.number().int().positive().optional(),
    servicoId: z.coerce.number().int().positive().optional(),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    hora: z.string().min(4).optional(),
    status: z.enum(['agendado', 'cumprido', 'naoCumprido']).optional(),
    justificativa: z.string().optional(),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID do agendamento deve ser numérico'),
  }),
  body: z.object({
    status: z.enum(['agendado', 'cumprido', 'naoCumprido'], {
      required_error: 'Status é obrigatório',
    }),
    justificativa: z.string().optional(),
  }),
});

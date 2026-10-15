import { query } from '../config/db';
import { User, UserRow } from '../types';

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    nome: row.nome,
    cnpj: row.cnpj,
    areaAtuacao: row.area_atuacao,
    login: row.login,
    email: row.email,
    telefone: row.telefone,
    endereco: row.endereco,
    nomeEmpresa: row.nome_empresa,
    fotoPerfil: row.foto_perfil,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProfile(userId: string): Promise<User> {
  const result = await query<UserRow>('SELECT * FROM users WHERE id = $1', [userId]);

  if (result.rows.length === 0) {
    const error: any = new Error('Usuário não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return mapUserRow(result.rows[0]);
}

export async function updateProfile(
  userId: string,
  data: Partial<{
    nome: string;
    cnpj: string;
    areaAtuacao: string;
    email: string;
    telefone: string;
    endereco: string;
    nomeEmpresa: string;
    fotoPerfil: string;
  }>
): Promise<User> {
  // Buscar usuário atual
  const current = await query<UserRow>('SELECT * FROM users WHERE id = $1', [userId]);
  if (current.rows.length === 0) {
    const error: any = new Error('Usuário não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const existing = current.rows[0];

  const updateSql = `
    UPDATE users
    SET
      nome = COALESCE($1, nome),
      cnpj = COALESCE($2, cnpj),
      area_atuacao = COALESCE($3, area_atuacao),
      email = COALESCE($4, email),
      telefone = COALESCE($5, telefone),
      endereco = COALESCE($6, endereco),
      nome_empresa = COALESCE($7, nome_empresa),
      foto_perfil = COALESCE($8, foto_perfil),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $9
    RETURNING *
  `;

  const result = await query<UserRow>(updateSql, [
    data.nome !== undefined ? data.nome : null,
    data.cnpj !== undefined ? data.cnpj : null,
    data.areaAtuacao !== undefined ? data.areaAtuacao : null,
    data.email !== undefined ? data.email : null,
    data.telefone !== undefined ? data.telefone : null,
    data.endereco !== undefined ? data.endereco : null,
    data.nomeEmpresa !== undefined ? data.nomeEmpresa : null,
    data.fotoPerfil !== undefined ? data.fotoPerfil : null,
    userId,
  ]);

  return mapUserRow(result.rows[0]);
}

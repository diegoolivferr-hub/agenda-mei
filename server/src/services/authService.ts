import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';
import { env } from '../config/env';
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

export async function register(data: {
  nome: string;
  cnpj: string;
  areaAtuacao: string;
  login: string;
  senha: string;
}): Promise<{ user: User; token: string }> {
  // Verificar se login já existe
  const existingLogin = await query('SELECT id FROM users WHERE login = $1', [data.login]);
  if (existingLogin.rows.length > 0) {
    const error: any = new Error('O login informado já está em uso.');
    error.statusCode = 409;
    throw error;
  }

  // Verificar se CNPJ já existe
  const existingCnpj = await query('SELECT id FROM users WHERE cnpj = $1', [data.cnpj]);
  if (existingCnpj.rows.length > 0) {
    const error: any = new Error('O CNPJ informado já está cadastrado.');
    error.statusCode = 409;
    throw error;
  }

  // Gerar hash seguro da senha
  const passwordHash = await bcrypt.hash(data.senha, env.SALT_ROUNDS);

  // Inserir usuário
  const insertSql = `
    INSERT INTO users (nome, cnpj, area_atuacao, login, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await query<UserRow>(insertSql, [
    data.nome,
    data.cnpj,
    data.areaAtuacao,
    data.login,
    passwordHash,
  ]);

  const user = mapUserRow(result.rows[0]);

  // Gerar JWT
  const token = jwt.sign(
    { userId: user.id, login: user.login },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  return { user, token };
}

export async function login(data: {
  login: string;
  senha: string;
}): Promise<{ user: User; token: string }> {
  const result = await query<UserRow>('SELECT * FROM users WHERE login = $1', [data.login]);

  if (result.rows.length === 0) {
    const error: any = new Error('Credenciais inválidas: login ou senha incorretos.');
    error.statusCode = 401;
    throw error;
  }

  const userRow = result.rows[0];
  const isPasswordValid = await bcrypt.compare(data.senha, userRow.password_hash);

  if (!isPasswordValid) {
    const error: any = new Error('Credenciais inválidas: login ou senha incorretos.');
    error.statusCode = 401;
    throw error;
  }

  const user = mapUserRow(userRow);

  const token = jwt.sign(
    { userId: user.id, login: user.login },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  return { user, token };
}

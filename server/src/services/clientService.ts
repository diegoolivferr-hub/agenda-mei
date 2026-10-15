import { query } from '../config/db';
import { Client, ClientRow } from '../types';

function mapClientRow(row: ClientRow): Client {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome,
    telefone: row.telefone,
    email: row.email,
    observacoes: row.observacoes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listClients(userId: string, search?: string): Promise<Client[]> {
  let sql = 'SELECT * FROM clients WHERE user_id = $1';
  const params: any[] = [userId];

  if (search && search.trim() !== '') {
    sql += ' AND (nome ILIKE $2 OR telefone ILIKE $2 OR email ILIKE $2)';
    params.push(`%${search.trim()}%`);
  }

  sql += ' ORDER BY nome ASC';

  const result = await query<ClientRow>(sql, params);
  return result.rows.map(mapClientRow);
}

export async function getClientById(userId: string, id: number): Promise<Client> {
  const result = await query<ClientRow>(
    'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
    [id, userId]
  );

  if (result.rows.length === 0) {
    const error: any = new Error('Cliente não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return mapClientRow(result.rows[0]);
}

export async function createClient(
  userId: string,
  data: {
    nome: string;
    telefone: string;
    email?: string;
    observacoes?: string;
  }
): Promise<Client> {
  const sql = `
    INSERT INTO clients (user_id, nome, telefone, email, observacoes)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await query<ClientRow>(sql, [
    userId,
    data.nome,
    data.telefone,
    data.email || null,
    data.observacoes || null,
  ]);

  return mapClientRow(result.rows[0]);
}

export async function updateClient(
  userId: string,
  id: number,
  data: Partial<{
    nome: string;
    telefone: string;
    email: string;
    observacoes: string;
  }>
): Promise<Client> {
  // Confirmar que cliente pertence ao usuário
  await getClientById(userId, id);

  const sql = `
    UPDATE clients
    SET
      nome = COALESCE($1, nome),
      telefone = COALESCE($2, telefone),
      email = COALESCE($3, email),
      observacoes = COALESCE($4, observacoes),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND user_id = $6
    RETURNING *
  `;

  const result = await query<ClientRow>(sql, [
    data.nome !== undefined ? data.nome : null,
    data.telefone !== undefined ? data.telefone : null,
    data.email !== undefined ? data.email : null,
    data.observacoes !== undefined ? data.observacoes : null,
    id,
    userId,
  ]);

  return mapClientRow(result.rows[0]);
}

export async function deleteClient(userId: string, id: number): Promise<void> {
  // Confirmar existência
  await getClientById(userId, id);

  // Verificar se há compromissos vinculados
  const appointmentsCheck = await query(
    'SELECT id FROM appointments WHERE cliente_id = $1 AND user_id = $2 LIMIT 1',
    [id, userId]
  );

  if (appointmentsCheck.rows.length > 0) {
    const error: any = new Error(
      'Não é possível excluir o cliente pois ele possui agendamentos vinculados.'
    );
    error.statusCode = 400;
    throw error;
  }

  await query('DELETE FROM clients WHERE id = $1 AND user_id = $2', [id, userId]);
}

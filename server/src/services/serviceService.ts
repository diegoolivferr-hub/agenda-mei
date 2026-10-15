import { query } from '../config/db';
import { Service, ServiceRow } from '../types';

function mapServiceRow(row: ServiceRow): Service {
  return {
    id: row.id,
    userId: row.user_id,
    descricao: row.descricao,
    preco: typeof row.preco === 'string' ? parseFloat(row.preco) : row.preco,
    disponivel: row.disponivel,
    categoria: row.categoria,
    observacoes: row.observacoes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listServices(userId: string, search?: string): Promise<Service[]> {
  let sql = 'SELECT * FROM services WHERE user_id = $1';
  const params: any[] = [userId];

  if (search && search.trim() !== '') {
    sql += ' AND (descricao ILIKE $2 OR categoria ILIKE $2)';
    params.push(`%${search.trim()}%`);
  }

  sql += ' ORDER BY descricao ASC';

  const result = await query<ServiceRow>(sql, params);
  return result.rows.map(mapServiceRow);
}

export async function getServiceById(userId: string, id: number): Promise<Service> {
  const result = await query<ServiceRow>(
    'SELECT * FROM services WHERE id = $1 AND user_id = $2',
    [id, userId]
  );

  if (result.rows.length === 0) {
    const error: any = new Error('Serviço não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return mapServiceRow(result.rows[0]);
}

export async function createService(
  userId: string,
  data: {
    descricao: string;
    preco: number;
    disponivel?: boolean;
    categoria: string;
    observacoes?: string;
  }
): Promise<Service> {
  const sql = `
    INSERT INTO services (user_id, descricao, preco, disponivel, categoria, observacoes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const result = await query<ServiceRow>(sql, [
    userId,
    data.descricao,
    data.preco,
    data.disponivel !== undefined ? data.disponivel : true,
    data.categoria,
    data.observacoes || null,
  ]);

  return mapServiceRow(result.rows[0]);
}

export async function updateService(
  userId: string,
  id: number,
  data: Partial<{
    descricao: string;
    preco: number;
    disponivel: boolean;
    categoria: string;
    observacoes: string;
  }>
): Promise<Service> {
  await getServiceById(userId, id);

  const sql = `
    UPDATE services
    SET
      descricao = COALESCE($1, descricao),
      preco = COALESCE($2, preco),
      disponivel = COALESCE($3, disponivel),
      categoria = COALESCE($4, categoria),
      observacoes = COALESCE($5, observacoes),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND user_id = $7
    RETURNING *
  `;

  const result = await query<ServiceRow>(sql, [
    data.descricao !== undefined ? data.descricao : null,
    data.preco !== undefined ? data.preco : null,
    data.disponivel !== undefined ? data.disponivel : null,
    data.categoria !== undefined ? data.categoria : null,
    data.observacoes !== undefined ? data.observacoes : null,
    id,
    userId,
  ]);

  return mapServiceRow(result.rows[0]);
}

export async function deleteService(userId: string, id: number): Promise<void> {
  await getServiceById(userId, id);

  const appointmentsCheck = await query(
    'SELECT id FROM appointments WHERE servico_id = $1 AND user_id = $2 LIMIT 1',
    [id, userId]
  );

  if (appointmentsCheck.rows.length > 0) {
    const error: any = new Error(
      'Não é possível excluir o serviço pois ele possui agendamentos vinculados.'
    );
    error.statusCode = 400;
    throw error;
  }

  await query('DELETE FROM services WHERE id = $1 AND user_id = $2', [id, userId]);
}

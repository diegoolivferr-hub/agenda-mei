import { query } from '../config/db';
import { Appointment, AppointmentRow } from '../types';

function formatData(val: string | Date): string {
  if (typeof val === 'string') {
    return val.split('T')[0];
  }
  return val.toISOString().split('T')[0];
}

function mapAppointmentRow(row: any): Appointment {
  return {
    id: row.id,
    userId: row.user_id,
    clienteId: row.cliente_id,
    clienteNome: row.cliente_nome || undefined,
    servicoId: row.servico_id,
    servicoNome: row.servico_nome || undefined,
    data: formatData(row.data),
    hora: row.hora,
    status: row.status,
    justificativa: row.justificativa,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAppointments(
  userId: string,
  filters?: {
    status?: string;
    data?: string;
    clienteId?: number;
  }
): Promise<Appointment[]> {
  let sql = `
    SELECT 
      a.*,
      c.nome AS cliente_nome,
      s.descricao AS servico_nome
    FROM appointments a
    JOIN clients c ON c.id = a.cliente_id
    JOIN services s ON s.id = a.servico_id
    WHERE a.user_id = $1
  `;
  const params: any[] = [userId];

  if (filters?.status) {
    params.push(filters.status);
    sql += ` AND a.status = $${params.length}`;
  }

  if (filters?.data) {
    params.push(filters.data);
    sql += ` AND a.data = $${params.length}`;
  }

  if (filters?.clienteId) {
    params.push(filters.clienteId);
    sql += ` AND a.cliente_id = $${params.length}`;
  }

  sql += ' ORDER BY a.data ASC, a.hora ASC';

  const result = await query(sql, params);
  return result.rows.map(mapAppointmentRow);
}

export async function getAppointmentById(userId: string, id: number): Promise<Appointment> {
  const sql = `
    SELECT 
      a.*,
      c.nome AS cliente_nome,
      s.descricao AS servico_nome
    FROM appointments a
    JOIN clients c ON c.id = a.cliente_id
    JOIN services s ON s.id = a.servico_id
    WHERE a.id = $1 AND a.user_id = $2
  `;

  const result = await query(sql, [id, userId]);

  if (result.rows.length === 0) {
    const error: any = new Error('Agendamento não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return mapAppointmentRow(result.rows[0]);
}

export async function createAppointment(
  userId: string,
  data: {
    clienteId: number;
    servicoId: number;
    data: string;
    hora: string;
    status?: 'agendado' | 'cumprido' | 'naoCumprido';
    justificativa?: string;
  }
): Promise<Appointment> {
  // Validar se cliente pertence ao usuário
  const clientCheck = await query(
    'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
    [data.clienteId, userId]
  );
  if (clientCheck.rows.length === 0) {
    const error: any = new Error('Cliente informado não existe ou não pertence a este usuário.');
    error.statusCode = 400;
    throw error;
  }

  // Validar se serviço pertence ao usuário
  const serviceCheck = await query(
    'SELECT id FROM services WHERE id = $1 AND user_id = $2',
    [data.servicoId, userId]
  );
  if (serviceCheck.rows.length === 0) {
    const error: any = new Error('Serviço informado não existe ou não pertence a este usuário.');
    error.statusCode = 400;
    throw error;
  }

  const insertSql = `
    INSERT INTO appointments (user_id, cliente_id, servico_id, data, hora, status, justificativa)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const result = await query(insertSql, [
    userId,
    data.clienteId,
    data.servicoId,
    data.data,
    data.hora,
    data.status || 'agendado',
    data.justificativa || null,
  ]);

  return getAppointmentById(userId, result.rows[0].id);
}

export async function updateAppointment(
  userId: string,
  id: number,
  data: Partial<{
    clienteId: number;
    servicoId: number;
    data: string;
    hora: string;
    status: 'agendado' | 'cumprido' | 'naoCumprido';
    justificativa: string;
  }>
): Promise<Appointment> {
  await getAppointmentById(userId, id);

  if (data.clienteId) {
    const clientCheck = await query(
      'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
      [data.clienteId, userId]
    );
    if (clientCheck.rows.length === 0) {
      const error: any = new Error('Cliente informado não existe.');
      error.statusCode = 400;
      throw error;
    }
  }

  if (data.servicoId) {
    const serviceCheck = await query(
      'SELECT id FROM services WHERE id = $1 AND user_id = $2',
      [data.servicoId, userId]
    );
    if (serviceCheck.rows.length === 0) {
      const error: any = new Error('Serviço informado não existe.');
      error.statusCode = 400;
      throw error;
    }
  }

  const sql = `
    UPDATE appointments
    SET
      cliente_id = COALESCE($1, cliente_id),
      servico_id = COALESCE($2, servico_id),
      data = COALESCE($3, data),
      hora = COALESCE($4, hora),
      status = COALESCE($5, status),
      justificativa = COALESCE($6, justificativa),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7 AND user_id = $8
    RETURNING id
  `;

  await query(sql, [
    data.clienteId !== undefined ? data.clienteId : null,
    data.servicoId !== undefined ? data.servicoId : null,
    data.data !== undefined ? data.data : null,
    data.hora !== undefined ? data.hora : null,
    data.status !== undefined ? data.status : null,
    data.justificativa !== undefined ? data.justificativa : null,
    id,
    userId,
  ]);

  return getAppointmentById(userId, id);
}

export async function updateAppointmentStatus(
  userId: string,
  id: number,
  status: 'agendado' | 'cumprido' | 'naoCumprido',
  justificativa?: string
): Promise<Appointment> {
  await getAppointmentById(userId, id);

  const sql = `
    UPDATE appointments
    SET
      status = $1,
      justificativa = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3 AND user_id = $4
    RETURNING id
  `;

  await query(sql, [status, justificativa || null, id, userId]);

  return getAppointmentById(userId, id);
}

export async function deleteAppointment(userId: string, id: number): Promise<void> {
  await getAppointmentById(userId, id);
  await query('DELETE FROM appointments WHERE id = $1 AND user_id = $2', [id, userId]);
}

import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

const poolConfig: PoolConfig = env.DATABASE_URL
  ? {
      connectionString: env.DATABASE_URL,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
    }
  : {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  // Evitar crash inesperado em idle clients
  console.error('[DB] Erro inesperado no cliente de banco de dados:', err.message);
});

/**
 * Executa uma query SQL parametrizada no PostgreSQL
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

/**
 * Verifica a conectividade com o banco de dados PostgreSQL
 */
export async function checkDbConnection(): Promise<{ isConnected: boolean; message: string }> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return {
        isConnected: true,
        message: 'Conexão com PostgreSQL ativa e respondendo.',
      };
    } finally {
      client.release();
    }
  } catch (error: any) {
    return {
      isConnected: false,
      message: `PostgreSQL inacessível: ${error.message || 'Falha de autenticação ou conexão'}. Verifique as credenciais no .env.`,
    };
  }
}

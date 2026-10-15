import { Request, Response } from 'express';
import { checkDbConnection } from '../config/db';

export async function getHealth(req: Request, res: Response): Promise<void> {
  const dbStatus = await checkDbConnection();

  const responsePayload = {
    status: 'ok',
    api: 'Agenda-MEI REST API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.isConnected,
      status: dbStatus.isConnected ? 'online' : 'aguardando_configuracao',
      mensagem: dbStatus.message,
    },
  };

  // Se o banco não estiver conectado, a API continua operacional (status 200 na saúde da API)
  // com indicação clara do estado da persistência
  res.status(200).json(responsePayload);
}

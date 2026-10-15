import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// CORS configurado para o front-end
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Parsers com limite adequado para suportar avatar em base64 se necessário
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de log de requisições simples
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mensagem raiz
app.get('/', (req: Request, res: Response) => {
  res.json({
    app: 'Agenda-MEI REST API',
    status: 'online',
    documentacao: '/api/health',
  });
});

// Rotas da API
app.use('/api', apiRoutes);

// Tratamento para rotas inexistentes (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    erro: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Middleware centralizado de tratamento de erros
app.use(errorHandler);

export default app;

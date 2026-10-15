import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[ERRO INTERNO]', {
    rota: `${req.method} ${req.originalUrl}`,
    mensagem: err.message,
    codigo: err.code,
  });

  // Erros de conexão do PostgreSQL
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
    res.status(503).json({
      erro: 'Serviço de banco de dados temporariamente indisponível. Verifique se o PostgreSQL está em execução.',
    });
    return;
  }

  // Falha de autenticação do PostgreSQL (senha errada / usuário inválido)
  if (err.code === '28P01') {
    res.status(503).json({
      erro: 'Falha na autenticação com o PostgreSQL. Verifique usuário e senha no arquivo .env.',
    });
    return;
  }

  // Violação de constraint UNIQUE (ex: login ou cnpj duplicado)
  if (err.code === '23505') {
    res.status(409).json({
      erro: 'Registro duplicado. Já existe um cadastro com os dados informados.',
      detalhe: err.detail,
    });
    return;
  }

  // Violação de Foreign Key (ex: cliente ou serviço inexistente ao agendar)
  if (err.code === '23503') {
    res.status(400).json({
      erro: 'Referência inválida: o cliente ou serviço especificado não existe.',
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const mensagem = statusCode === 500 
    ? 'Ocorreu um erro interno no servidor.' 
    : err.message;

  res.status(statusCode).json({ erro: mensagem });
}

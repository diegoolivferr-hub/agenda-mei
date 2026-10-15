import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { TokenPayload } from '../types';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userLogin?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ erro: 'Token de autenticação não fornecido' });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ erro: 'Formato de token inválido. Use Bearer <token>' });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.userId = decoded.userId;
    req.userLogin = decoded.login;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ erro: 'Token expirado. Por favor, faça login novamente' });
      return;
    }
    res.status(401).json({ erro: 'Token inválido ou não autorizado' });
    return;
  }
}

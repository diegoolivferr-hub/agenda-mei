import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nome, cnpj, areaAtuacao, login, senha } = req.body;
    const result = await authService.register({
      nome,
      cnpj,
      areaAtuacao,
      login,
      senha,
    });

    res.status(201).json({
      mensagem: 'Usuário MEI cadastrado com sucesso!',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { login, senha } = req.body;
    const result = await authService.login({ login, senha });

    res.status(200).json({
      mensagem: 'Autenticação realizada com sucesso!',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

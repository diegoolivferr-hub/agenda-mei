import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import * as userService from '../services/userService';

export async function handleGetProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const profile = await userService.getProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const updated = await userService.updateProfile(userId, req.body);
    res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso!',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
}

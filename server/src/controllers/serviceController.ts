import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import * as serviceService from '../services/serviceService';

export async function handleListServices(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const search = req.query.busca as string | undefined;
    const services = await serviceService.listServices(userId, search);
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
}

export async function handleGetService(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    const service = await serviceService.getServiceById(userId, id);
    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
}

export async function handleCreateService(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const created = await serviceService.createService(userId, req.body);
    res.status(201).json({
      mensagem: 'Serviço cadastrado com sucesso!',
      servico: created,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateService(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    const updated = await serviceService.updateService(userId, id, req.body);
    res.status(200).json({
      mensagem: 'Serviço atualizado com sucesso!',
      servico: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteService(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    await serviceService.deleteService(userId, id);
    res.status(200).json({ mensagem: 'Serviço removido com sucesso!' });
  } catch (error) {
    next(error);
  }
}

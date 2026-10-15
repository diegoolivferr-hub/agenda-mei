import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import * as clientService from '../services/clientService';

export async function handleListClients(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const search = req.query.busca as string | undefined;
    const clients = await clientService.listClients(userId, search);
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
}

export async function handleGetClient(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    const client = await clientService.getClientById(userId, id);
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
}

export async function handleCreateClient(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const client = await clientService.createClient(userId, req.body);
    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso!',
      cliente: client,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateClient(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    const updated = await clientService.updateClient(userId, id, req.body);
    res.status(200).json({
      mensagem: 'Cliente atualizado com sucesso!',
      cliente: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteClient(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    await clientService.deleteClient(userId, id);
    res.status(200).json({ mensagem: 'Cliente removido com sucesso!' });
  } catch (error) {
    next(error);
  }
}

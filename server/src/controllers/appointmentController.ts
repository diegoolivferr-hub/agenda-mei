import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import * as appointmentService from '../services/appointmentService';

export async function handleListAppointments(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const status = req.query.status as string | undefined;
    const data = req.query.data as string | undefined;
    const clienteId = req.query.clienteId
      ? parseInt(req.query.clienteId as string, 10)
      : undefined;

    const appointments = await appointmentService.listAppointments(userId, {
      status,
      data,
      clienteId,
    });
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
}

export async function handleGetAppointment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    const appointment = await appointmentService.getAppointmentById(userId, id);
    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
}

export async function handleCreateAppointment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const created = await appointmentService.createAppointment(userId, req.body);
    res.status(201).json({
      mensagem: 'Agendamento cadastrado com sucesso!',
      agendamento: created,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateAppointment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    const updated = await appointmentService.updateAppointment(userId, id, req.body);
    res.status(200).json({
      mensagem: 'Agendamento atualizado com sucesso!',
      agendamento: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    const { status, justificativa } = req.body;
    const updated = await appointmentService.updateAppointmentStatus(
      userId,
      id,
      status,
      justificativa
    );
    res.status(200).json({
      mensagem: `Status do agendamento atualizado para '${status}' com sucesso!`,
      agendamento: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteAppointment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id as string, 10);
    await appointmentService.deleteAppointment(userId, id);
    res.status(200).json({ mensagem: 'Agendamento cancelado/removido com sucesso!' });
  } catch (error) {
    next(error);
  }
}

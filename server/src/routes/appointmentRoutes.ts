import { Router } from 'express';
import {
  handleListAppointments,
  handleGetAppointment,
  handleCreateAppointment,
  handleUpdateAppointment,
  handleUpdateStatus,
  handleDeleteAppointment,
} from '../controllers/appointmentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
} from '../validations/schemas';

const router = Router();

router.use(authMiddleware);

router.get('/', handleListAppointments);
router.get('/:id', handleGetAppointment);
router.post('/', validate(createAppointmentSchema), handleCreateAppointment);
router.put('/:id', validate(updateAppointmentSchema), handleUpdateAppointment);
router.patch('/:id/status', validate(updateAppointmentStatusSchema), handleUpdateStatus);
router.delete('/:id', handleDeleteAppointment);

export default router;

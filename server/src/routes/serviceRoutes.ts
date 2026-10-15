import { Router } from 'express';
import {
  handleListServices,
  handleGetService,
  handleCreateService,
  handleUpdateService,
  handleDeleteService,
} from '../controllers/serviceController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import { createServiceSchema, updateServiceSchema } from '../validations/schemas';

const router = Router();

router.use(authMiddleware);

router.get('/', handleListServices);
router.get('/:id', handleGetService);
router.post('/', validate(createServiceSchema), handleCreateService);
router.put('/:id', validate(updateServiceSchema), handleUpdateService);
router.delete('/:id', handleDeleteService);

export default router;

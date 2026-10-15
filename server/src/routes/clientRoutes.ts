import { Router } from 'express';
import {
  handleListClients,
  handleGetClient,
  handleCreateClient,
  handleUpdateClient,
  handleDeleteClient,
} from '../controllers/clientController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import { createClientSchema, updateClientSchema } from '../validations/schemas';

const router = Router();

router.use(authMiddleware);

router.get('/', handleListClients);
router.get('/:id', handleGetClient);
router.post('/', validate(createClientSchema), handleCreateClient);
router.put('/:id', validate(updateClientSchema), handleUpdateClient);
router.delete('/:id', handleDeleteClient);

export default router;

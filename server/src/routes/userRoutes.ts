import { Router } from 'express';
import { handleGetProfile, handleUpdateProfile } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import { updateProfileSchema } from '../validations/schemas';

const router = Router();

router.use(authMiddleware);

router.get('/profile', handleGetProfile);
router.put('/profile', validate(updateProfileSchema), handleUpdateProfile);

export default router;

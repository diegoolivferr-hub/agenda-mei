import { Router } from 'express';
import { handleRegister, handleLogin } from '../controllers/authController';
import { validate } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validations/schemas';

const router = Router();

router.post('/register', validate(registerSchema), handleRegister);
router.post('/login', validate(loginSchema), handleLogin);

export default router;

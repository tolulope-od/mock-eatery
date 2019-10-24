import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = Router();

const { registerUser, login } = AuthController;
const { validateRegistration, validateLogin } = AuthMiddleware;

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, login);

export default router;

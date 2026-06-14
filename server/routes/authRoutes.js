import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import AuthValidation from '../middleware/authValidation.js';

const router = Router();

// register
router.post('/register-step1', AuthValidation.registerStep1, AuthController.registerStep1);
router.put('/register-step2', AuthValidation.registerStep2, AuthController.registerStep2);

// login
router.post('/login', AuthValidation.login, AuthController.login);
router.get('/check-auth/:id', AuthController.checkAuthStatus);

export default router;
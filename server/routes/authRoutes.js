import { Router } from 'express';
import { completeGoogleLogin, getCurrentUser, login, logout, register, startGoogleLogin } from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/google', startGoogleLogin);
router.get('/google/callback', completeGoogleLogin);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
export default router;

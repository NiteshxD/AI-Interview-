import { Router } from 'express';
import { register, login, googleAuth, getProfile, updateProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', googleAuth);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router;

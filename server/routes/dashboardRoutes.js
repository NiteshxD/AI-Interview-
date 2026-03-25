import { Router } from 'express';
import { getStats } from '../controllers/dashboardController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/stats', auth, getStats);

export default router;

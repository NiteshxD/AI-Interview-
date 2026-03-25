import { Router } from 'express';
import { getProblem, runCode, getLanguages } from '../controllers/codingController.js';
import auth from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/problem', auth, aiLimiter, getProblem);
router.post('/execute', auth, aiLimiter, runCode);
router.get('/languages', auth, getLanguages);

export default router;

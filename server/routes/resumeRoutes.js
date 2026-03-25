import { Router } from 'express';
import { analyzeResume, getResumeHistory, upload } from '../controllers/resumeController.js';
import auth from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/analyze', auth, aiLimiter, upload.single('resume'), analyzeResume);
router.get('/history', auth, getResumeHistory);

export default router;

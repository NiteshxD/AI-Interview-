import { Router } from 'express';
import { startInterview, respondToInterview, endInterview, getInterviewHistory, getInterview } from '../controllers/interviewController.js';
import auth from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/start', auth, aiLimiter, startInterview);
router.post('/respond', auth, aiLimiter, respondToInterview);
router.post('/end', auth, endInterview);
router.get('/history', auth, getInterviewHistory);
router.get('/:id', auth, getInterview);

export default router;

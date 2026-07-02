import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { profile, updateWatermark } from '../controllers/profile.js';

const profileRouter = Router();
profileRouter.get('/', authMiddleware, profile);
profileRouter.post('/watermark', authMiddleware, updateWatermark);
export default profileRouter;

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { profile } from '../controllers/profile.js';

const profileRouter = Router();
profileRouter.get('/', authMiddleware, profile);
export default profileRouter;

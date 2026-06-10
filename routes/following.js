import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { following } from '../controllers/profile.js';

const followingRouter = Router();
followingRouter.get('/', authMiddleware, following);
export default followingRouter;

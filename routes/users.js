import { Router } from 'express';
import { toggleFollow } from '../controllers/users.js';
import { publicProfile } from '../controllers/profile.js';
import { authMiddleware } from '../middlewares/auth.js';

const users = Router();

users.get('/:userId', publicProfile);
users.post('/:userId/follow', authMiddleware, toggleFollow);

export default users;

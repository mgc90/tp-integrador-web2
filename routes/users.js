import { Router } from 'express';
import { toggleFollow } from '../controllers/users.js';
import { authMiddleware } from '../middlewares/auth.js';

const users = Router();

users.post('/:userId/follow', authMiddleware, toggleFollow);

export default users;

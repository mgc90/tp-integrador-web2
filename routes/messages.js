import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { index, chat, send } from '../controllers/messages.js';

const messagesRouter = Router();

messagesRouter.use(authMiddleware);

messagesRouter.get('/', index);
messagesRouter.get('/:userId', chat);
messagesRouter.post('/:userId', send);

export default messagesRouter;

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { index, markAsRead, markAllAsRead } from '../controllers/notifications.js';

const notificationsRouter = Router();

notificationsRouter.use(authMiddleware);

notificationsRouter.get('/', index);
notificationsRouter.post('/:id/read', markAsRead);
notificationsRouter.post('/read-all', markAllAsRead);

export default notificationsRouter;

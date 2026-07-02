import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { reportImage, reportComment } from '../controllers/reports.js';

const reportsRouter = Router();

reportsRouter.use(authMiddleware);

reportsRouter.post('/images/:imageId', reportImage);
reportsRouter.post('/comments/:commentId', reportComment);

export default reportsRouter;

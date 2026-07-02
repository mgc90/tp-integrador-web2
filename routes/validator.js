import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { validatorMiddleware } from '../middlewares/validator.js';
import {
  dashboard,
  takeDownPost,
  dismissPostReports,
  deleteReportedComment,
  dismissCommentReports,
} from '../controllers/validator.js';

const validatorRouter = Router();

validatorRouter.use(authMiddleware);
validatorRouter.use(validatorMiddleware);

validatorRouter.get('/', dashboard);
validatorRouter.post('/posts/:id/takedown', takeDownPost);
validatorRouter.post('/posts/:id/dismiss', dismissPostReports);
validatorRouter.post('/comments/:id/delete', deleteReportedComment);
validatorRouter.post('/comments/:id/dismiss', dismissCommentReports);

export default validatorRouter;

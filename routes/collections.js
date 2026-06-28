import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
  index,
  createForm,
  create,
  detail,
  addPost,
  removePost,
  destroy,
} from '../controllers/collections.js';

const collectionsRouter = Router();

collectionsRouter.use(authMiddleware);

collectionsRouter.get('/', index);
collectionsRouter.get('/create', createForm);
collectionsRouter.post('/', create);
collectionsRouter.get('/:id', detail);
collectionsRouter.post('/:id/posts/:postId', addPost);
collectionsRouter.post('/:id/posts/:postId/delete', removePost);
collectionsRouter.post('/:id/delete', destroy);

export default collectionsRouter;

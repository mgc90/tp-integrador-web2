import { Router } from 'express';
import { createForm, create, detail, addComment, deleteComment, rateImage, closeComments, openComments, toggleInterest, editForm, update } from '../controllers/posts.js';
import { toggleFavorite } from '../controllers/collections.js';
import { authMiddleware } from '../middlewares/auth.js';
import { uploadImages } from '../middlewares/upload.js';

const posts = Router();

posts.get('/new', authMiddleware, createForm);
posts.post('/new',
  authMiddleware,
  uploadImages,
  create
);

posts.get('/:postId', detail);
posts.post('/:postId/images/:imageId/comments', authMiddleware, addComment);
posts.post('/:postId/images/:imageId/comments/:commentId/delete', authMiddleware, deleteComment);
posts.post('/:postId/images/:imageId/rate', authMiddleware, rateImage);
posts.post('/:postId/images/:imageId/interest', authMiddleware, toggleInterest);
posts.post('/:postId/images/:imageId/close-comments', authMiddleware, closeComments);
posts.post('/:postId/images/:imageId/open-comments', authMiddleware, openComments);
posts.post('/:postId/favorite', authMiddleware, toggleFavorite);
posts.get('/:postId/edit', authMiddleware, editForm);
posts.post('/:postId/edit', authMiddleware, update);

export default posts;

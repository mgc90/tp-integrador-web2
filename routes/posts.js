import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { createForm, create, detail, addComment, rateImage, closeComments, openComments } from '../controllers/posts.js';
import { authMiddleware } from '../middlewares/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    cb(null, extOk && mimeOk);
  }
});

const posts = Router();

posts.get('/new', authMiddleware, createForm);
posts.post('/new',
  authMiddleware,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]),
  create
);

posts.get('/:postId', detail);
posts.post('/:postId/images/:imageId/comments', authMiddleware, addComment);
posts.post('/:postId/images/:imageId/rate', authMiddleware, rateImage);
posts.post('/:postId/close-comments', authMiddleware, closeComments);
posts.post('/:postId/open-comments', authMiddleware, openComments);

export default posts;

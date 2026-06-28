import { Report } from '../models/Report.js';
import { Image } from '../models/Image.js';
import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';

export async function reportImage(req, res) {
  try {
    const imageId = Number(req.params.imageId);
    const userId = req.session.user.id;

    const image = await Image.findByPk(imageId, {
      include: [{ model: Post, attributes: ['userId'] }],
      attributes: ['id', 'postId'],
    });

    if (!image) return res.status(404).redirect('/');
    if (image.Post.userId === userId) return res.redirect('/posts/' + image.postId);

    const existing = await Report.findOne({
      where: { imageId, userId, status: 'pending' },
    });

    if (existing) return res.redirect('/posts/' + image.postId);

    await Report.create({
      imageId,
      userId,
      motivo: req.body.motivo || 'Sin motivo',
      descripcion: req.body.descripcion || null,
    });

    res.redirect('/posts/' + image.postId);
  } catch (error) {
    console.error('[!] Error al denunciar imagen:', error);
    res.redirect('/posts/' + image.postId);
  }
}

export async function reportComment(req, res) {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.session.user.id;

    const comment = await Comment.findByPk(commentId, {
      include: [{ model: Image, attributes: ['postId'] }],
      attributes: ['id', 'userId', 'imageId'],
    });

    if (!comment) return res.status(404).redirect('/');
    if (comment.userId === userId) return res.redirect('/posts/' + comment.Image.postId);

    const existing = await Report.findOne({
      where: { commentId, userId, status: 'pending' },
    });

    if (existing) return res.redirect('/posts/' + comment.Image.postId);

    await Report.create({
      commentId,
      userId,
      motivo: req.body.motivo || 'Sin motivo',
      descripcion: req.body.descripcion || null,
    });

    res.redirect('/posts/' + comment.Image.postId);
  } catch (error) {
    console.error('[!] Error al denunciar comentario:', error);
    res.redirect('/posts/' + comment.Image.postId);
  }
}

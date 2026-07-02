import { Post } from '../models/Post.js';
import { Image } from '../models/Image.js';
import { User } from '../models/User.js';
import { Report } from '../models/Report.js';
import { Comment } from '../models/Comment.js';
import sequelize from '../models/config.js';

export async function dashboard(req, res) {
  try {
    const [postRows] = await sequelize.query(`
      SELECT i."postId", r."status", COUNT(DISTINCT r."userId") AS "userCount"
      FROM "reports" r
      JOIN "images" i ON i."id" = r."imageId"
      GROUP BY i."postId", r."status"
      HAVING COUNT(DISTINCT r."userId") >= 3
    `);

    const reportStatusMap = {};
    const postIds = [];
    for (const r of postRows) {
      if (!reportStatusMap[r.postId]) {
        reportStatusMap[r.postId] = { pending: 0, dismissed: 0, resolved: 0, total: 0 };
        postIds.push(r.postId);
      }
      reportStatusMap[r.postId][r.status] = Number(r.userCount);
      reportStatusMap[r.postId].total += Number(r.userCount);
    }

    const reportedPosts = postIds.length
      ? await Post.findAll({
          where: { id: postIds },
          include: [
            { model: Image, as: 'images', attributes: ['id', 'url', 'thumbnailUrl'] },
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
          ],
        })
      : [];

    const [commentRows] = await sequelize.query(`
      SELECT r."commentId", r."status", COUNT(DISTINCT r."userId") AS "userCount"
      FROM "reports" r
      WHERE r."commentId" IS NOT NULL
      GROUP BY r."commentId", r."status"
    `);

    const commentStatusMap = {};
    const commentIds = [];
    for (const r of commentRows) {
      if (!commentStatusMap[r.commentId]) {
        commentStatusMap[r.commentId] = { pending: 0, dismissed: 0, resolved: 0, total: 0 };
        commentIds.push(r.commentId);
      }
      commentStatusMap[r.commentId][r.status] = Number(r.userCount);
      commentStatusMap[r.commentId].total += Number(r.userCount);
    }

    const reportedComments = commentIds.length
      ? await Comment.findAll({
          where: { id: commentIds },
          include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Image, attributes: ['id', 'postId'] },
          ],
          attributes: ['id', 'imageId', 'userId', 'content', 'createdAt'],
        })
      : [];

    res.render('validator/index', {
      reportedPosts,
      reportedComments,
      reportStatusMap,
      commentStatusMap,
    });
  } catch (error) {
    console.error('[!] Error en panel validador:', error);
    res.status(500).render('validator/index', {
      reportedPosts: [],
      reportedComments: [],
      reportStatusMap: {},
      commentStatusMap: {},
      alert: { status: 'error', text: 'Error al cargar el panel' },
    });
  }
}

export async function takeDownPost(req, res) {
  try {
    const postId = Number(req.params.id);
    const post = await Post.findByPk(postId, { attributes: ['id', 'userId'] });
    if (!post) return res.status(404).redirect('/validator');

    await post.update({ status: 'taken_down' });

    const imageIds = (await Image.findAll({ where: { postId }, attributes: ['id'] })).map(i => i.id);

    if (imageIds.length) {
      await Report.update(
        { status: 'resolved', resolvedBy: req.session.user.id, resolvedAt: new Date() },
        { where: { imageId: imageIds, status: 'pending' } },
      );
    }

    const takenDownCount = await Post.count({
      where: { userId: post.userId, status: 'taken_down' },
    });

    if (takenDownCount >= 3) {
      await User.update({ isActive: false }, { where: { id: post.userId } });
    }

    res.redirect('/validator');
  } catch (error) {
    console.error('[!] Error al dar de baja:', error);
    res.redirect('/validator');
  }
}

export async function dismissPostReports(req, res) {
  try {
    const postId = Number(req.params.id);
    const imageIds = (await Image.findAll({ where: { postId }, attributes: ['id'] })).map(i => i.id);

    if (imageIds.length) {
      await Report.update(
        { status: 'dismissed', resolvedBy: req.session.user.id, resolvedAt: new Date() },
        { where: { imageId: imageIds, status: 'pending' } },
      );
    }

    res.redirect('/validator');
  } catch (error) {
    console.error('[!] Error al desestimar denuncias:', error);
    res.redirect('/validator');
  }
}

export async function deleteReportedComment(req, res) {
  try {
    const commentId = Number(req.params.id);
    const comment = await Comment.findByPk(commentId, { attributes: ['id'] });
    if (!comment) return res.status(404).redirect('/validator');

    await Report.update(
      { status: 'resolved', resolvedBy: req.session.user.id, resolvedAt: new Date() },
      { where: { commentId, status: 'pending' } },
    );

    await comment.destroy();

    res.redirect('/validator');
  } catch (error) {
    console.error('[!] Error al eliminar comentario:', error);
    res.redirect('/validator');
  }
}

export async function dismissCommentReports(req, res) {
  try {
    const commentId = Number(req.params.id);

    await Report.update(
      { status: 'dismissed', resolvedBy: req.session.user.id, resolvedAt: new Date() },
      { where: { commentId, status: 'pending' } },
    );

    res.redirect('/validator');
  } catch (error) {
    console.error('[!] Error al desestimar denuncias:', error);
    res.redirect('/validator');
  }
}

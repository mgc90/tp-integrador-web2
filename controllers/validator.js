import { Post } from '../models/Post.js';
import { Image } from '../models/Image.js';
import { User } from '../models/User.js';
import { Report } from '../models/Report.js';
import { Comment } from '../models/Comment.js';
import sequelize from '../models/config.js';

export async function dashboard(req, res) {
  try {
    const [postRows] = await sequelize.query(`
      SELECT i."postId", COUNT(DISTINCT r."userId") AS "reportCount"
      FROM "reports" r
      JOIN "images" i ON i."id" = r."imageId"
      WHERE r."status" = 'pending'
      GROUP BY i."postId"
      HAVING COUNT(DISTINCT r."userId") >= 3
    `);

    const postIds = postRows.map(r => r.postId);

    const reportedPosts = postIds.length
      ? await Post.findAll({
          where: { id: postIds },
          include: [
            { model: Image, as: 'images', attributes: ['id', 'url', 'thumbnailUrl'] },
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
          ],
        })
      : [];

    const reportCountMap = {};
    for (const r of postRows) {
      reportCountMap[r.postId] = r.reportCount;
    }

    const reportedComments = await Comment.findAll({
      include: [
        { model: Report, where: { status: 'pending' }, required: true },
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: Image, attributes: ['id', 'postId'] },
      ],
      attributes: [
        'id', 'imageId', 'userId', 'content', 'createdAt',
        [sequelize.literal(`(
          SELECT COUNT(DISTINCT r2."userId")
          FROM "reports" r2
          WHERE r2."commentId" = "Comment"."id" AND r2."status" = 'pending'
        )`), 'reportCount'],
      ],
      group: ['Comment.id', 'Comment.imageId', 'Comment.userId', 'Comment.content', 'Comment.createdAt', 'User.id', 'User.firstName', 'User.lastName', 'Image.id', 'Image.postId', 'Reports.id'],
    });

    res.render('validator/index', {
      reportedPosts,
      reportedComments,
      reportCountMap,
    });
  } catch (error) {
    console.error('[!] Error en panel validador:', error);
    res.status(500).render('validator/index', {
      reportedPosts: [],
      reportedComments: [],
      reportCountMap: {},
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

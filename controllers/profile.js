import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { Tag } from "../models/Tag.js";
import { Follow } from "../models/Follow.js";
import sequelize from "../models/config.js";

export async function profile(req, res) {
  try {
    const user = await User.findByPk(req.session.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'watermarkText'],
    });

    if (!user) {
      return res.redirect('/auth/login');
    }

    const [followersCount, followingCount, posts] = await Promise.all([
      Follow.count({ where: { followedId: user.id } }),
      Follow.count({ where: { followerId: user.id } }),
      Post.findAll({
        include: [
          { model: Tag },
          { model: Image, as: 'images', attributes: ['id', 'url', 'thumbnailUrl', 'license'] },
          { model: User, attributes: ['id', 'firstName', 'lastName'] },
        ],
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      }),
    ]);

    res.render('profile', { user, posts, followersCount, followingCount, isOwnProfile: true });
  } catch (error) {
    console.error('[!] Error al cargar perfil:', error);
    res.redirect('/');
  }
}

export async function publicProfile(req, res) {
  try {
    const userId = Number(req.params.userId);

    if (req.session.user && req.session.user.id === userId) {
      return res.redirect('/profile');
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'avatar'],
    });

    if (!user) {
      return res.status(404).render('index', {
        alert: { status: 'error', text: 'Usuario no encontrado' }
      });
    }

    const [followersCount, followingCount, posts] = await Promise.all([
      Follow.count({ where: { followedId: user.id } }),
      Follow.count({ where: { followerId: user.id } }),
      Post.findAll({
        include: [
          { model: Tag },
          { model: Image, as: 'images', attributes: ['id', 'url', 'thumbnailUrl', 'license'] },
          { model: User, attributes: ['id', 'firstName', 'lastName'] },
        ],
        where: { userId: user.id, status: 'active' },
        order: [['createdAt', 'DESC']],
      }),
    ]);

    let isFollowing = false;
    if (req.session.user) {
      const follow = await Follow.findOne({
        where: { followerId: req.session.user.id, followedId: user.id },
        attributes: ['id'],
      });
      isFollowing = !!follow;
    }

    res.render('profile', {
      user,
      posts,
      followersCount,
      followingCount,
      isOwnProfile: false,
      isFollowing,
    });
  } catch (error) {
    console.error('[!] Error al cargar perfil público:', error);
    res.redirect('/');
  }
}

export async function updateWatermark(req, res) {
  try {
    const text = req.body.watermarkText ? req.body.watermarkText.trim() : null;
    await User.update({ watermarkText: text }, { where: { id: req.session.user.id } });
    res.redirect('/profile');
  } catch (error) {
    console.error('[!] Error al actualizar marca de agua:', error);
    res.redirect('/profile');
  }
}

export async function following(req, res) {
  const sort = req.query.sort || '';

  try {
    const followedUsers = await Follow.findAll({
      where: { followerId: req.session.user.id },
      attributes: ['followedId'],
    });

    const followedIds = followedUsers.map(f => f.followedId);
    let posts = [];

    if (followedIds.length > 0) {
      let order;
      if (sort === 'oldest') {
        order = [['createdAt', 'ASC']];
      } else if (sort === 'rating') {
        order = [
          [sequelize.literal(`(
            SELECT COALESCE(AVG("v"."value"), 0)
            FROM "valorations" AS "v"
            INNER JOIN "images" AS "i" ON "i"."id" = "v"."imageId"
            WHERE "i"."postId" = "Post"."id"
          )`), 'DESC NULLS LAST'],
          [sequelize.literal(`(
            SELECT COUNT("v"."id")
            FROM "valorations" AS "v"
            INNER JOIN "images" AS "i" ON "i"."id" = "v"."imageId"
            WHERE "i"."postId" = "Post"."id"
          )`), 'DESC NULLS LAST'],
        ];
      } else if (sort === 'newest') {
        order = [['createdAt', 'DESC']];
      } else if (sort === 'most-voted') {
        order = [[sequelize.literal(`(
          SELECT COALESCE(MAX(cnt), 0) FROM (
            SELECT COUNT("v"."id") * 100000 + ROUND(COALESCE(AVG("v"."value"), 0)::numeric, 2)::float8 AS cnt
            FROM "images" AS "i"
            LEFT JOIN "valorations" AS "v" ON "v"."imageId" = "i"."id"
            WHERE "i"."postId" = "Post"."id"
            GROUP BY "i"."id"
          ) AS sub
        )`), 'DESC NULLS LAST']];
      } else {
        order = [['createdAt', 'DESC']];
      }

      posts = await Post.findAll({
        include: [
          { model: Tag },
          { model: Image, as: 'images', attributes: ['id', 'url', 'license'] },
          { model: User, attributes: ['id', 'firstName', 'lastName'] },
        ],
        where: { userId: followedIds, status: 'active' },
        order,
      });

      if (req.session.user) {
        const authorIds = posts.map(p => p.userId).filter(Boolean);
        const follows = await Follow.findAll({
          where: { followerId: req.session.user.id, followedId: authorIds },
          attributes: ['followedId'],
        });
        const followedIdsSet = new Set(follows.map(f => f.followedId));
        for (const post of posts) {
          if (post.User) post.User.isFollowing = followedIdsSet.has(post.User.id);
        }
      }
    }

    res.locals.searchSort = sort;
    res.render('following', { posts, sort });
  } catch (error) {
    console.error('[!] Error al cargar posts de seguidos:', error);
    res.render('following', { posts: [], sort });
  }
}

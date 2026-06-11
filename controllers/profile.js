import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { Tag } from "../models/Tag.js";
import { Follow } from "../models/Follow.js";
import sequelize from "../models/config.js";

export async function profile(req, res) {
  try {
    const user = await User.findByPk(req.session.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
    });

    if (!user) {
      return res.redirect('/auth/login');
    }

    const [followersCount, followingCount] = await Promise.all([
      Follow.count({ where: { followedId: user.id } }),
      Follow.count({ where: { followerId: user.id } }),
    ]);

    res.render('profile', { user, followersCount, followingCount });
  } catch (error) {
    console.error('[!] Error al cargar perfil:', error);
    res.redirect('/');
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
        order = [[sequelize.literal(`(
          SELECT COALESCE(AVG("v"."value"), 0)
          FROM "valorations" AS "v"
          INNER JOIN "images" AS "i" ON "i"."id" = "v"."imageId"
          WHERE "i"."postId" = "Post"."id"
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
        where: { userId: followedIds },
        order,
      });
    }

    res.locals.searchSort = sort;
    res.render('following', { posts, sort });
  } catch (error) {
    console.error('[!] Error al cargar posts de seguidos:', error);
    res.render('following', { posts: [], sort });
  }
}

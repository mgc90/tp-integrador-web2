import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { User } from "../models/User.js";
import { Tag } from "../models/Tag.js";
import { Follow } from "../models/Follow.js";
import sequelize from "../models/config.js";

export async function feed(req, res) {
  const sort = req.query.sort || '';

  try {
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

    const posts = await Post.findAll({
      include: [
        { model: Tag },
        { model: Image, as: 'images', attributes: ['id', 'url', 'license'] },
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
      ],
      order,
    });

    if (req.session.user) {
      const authorIds = posts.map(p => p.userId).filter(Boolean);
      const follows = await Follow.findAll({
        where: { followerId: req.session.user.id, followedId: authorIds },
        attributes: ['followedId'],
      });
      const followedIds = new Set(follows.map(f => f.followedId));
      for (const post of posts) {
        if (post.User) post.User.isFollowing = followedIds.has(post.User.id);
      }
    }

    res.locals.searchSort = sort;
    res.render('feedBrowser', { posts, sort });
  } catch (error) {
    console.error('[!] Error al cargar posts:', error);
    res.render('feedBrowser', { posts: [], sort });
  }
}

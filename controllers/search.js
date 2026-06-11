import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { User } from "../models/User.js";
import { Tag } from "../models/Tag.js";
import { Follow } from "../models/Follow.js";
import { Op } from "sequelize";
import sequelize from "../models/config.js";

export async function search(req, res) {
  const q = (req.query.q || '').trim();
  const activeFilters = [].concat(req.query.filter || []);
  const sort = req.query.sort || '';

  if (!q) {
    return res.render('search', { posts: [], query: '', count: 0, activeFilters, sort });
  }

  try {
    const orConditions = [];

    if (activeFilters.length === 0) {
      orConditions.push(
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { '$Tags.name$': { [Op.iLike]: `%${q}%` } },
        { '$User.firstName$': { [Op.iLike]: `%${q}%` } },
        { '$User.lastName$': { [Op.iLike]: `%${q}%` } },
      );
    } else {
      if (activeFilters.includes('title')) {
        orConditions.push(
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
        );
      }
      if (activeFilters.includes('author')) {
        orConditions.push(
          { '$User.firstName$': { [Op.iLike]: `%${q}%` } },
          { '$User.lastName$': { [Op.iLike]: `%${q}%` } },
        );
      }
      if (activeFilters.includes('tag')) {
        orConditions.push(
          { '$Tags.name$': { [Op.iLike]: `%${q}%` } },
        );
      }
    }

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

    const posts = await Post.findAll({
      include: [
        { model: Image, as: 'images' },
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: Tag },
      ],
      where: { [Op.or]: orConditions },
      order,
      distinct: true,
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

    res.locals.searchQuery = q;
    res.locals.searchFilters = activeFilters;
    res.locals.searchSort = sort;
    res.render('search', { posts, query: q, count: posts.length, activeFilters, sort });
  } catch (error) {
    console.error('[!] Error en búsqueda:', error);
    res.render('search', { posts: [], query: q, count: 0, activeFilters, sort });
  }
}

import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { User } from "../models/User.js";
import { Tag } from "../models/Tag.js";
import { Follow } from "../models/Follow.js";
import { Op } from "sequelize";
import sequelize from "../models/config.js";

export async function search(req, res) {
  const q = (req.query.q || '').trim();
  let activeFilters = [].concat(req.query.filter || []);
  if (activeFilters.length === 0) activeFilters = ['title'];
  const sort = req.query.sort || '';
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = 12;
  const offset = (page - 1) * limit;

  if (!q) {
    return res.render('search', { posts: [], query: '', total: 0, activeFilters, sort, page, totalPages: 0 });
  }

  try {
    const postConditions = [];
    if (activeFilters.includes('title')) {
      postConditions.push(
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      );
    }

    const userInclude = {
      model: User,
      attributes: ['id', 'firstName', 'lastName'],
    };
    if (activeFilters.includes('author')) {
      userInclude.required = true;
      userInclude.where = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${q}%` } },
          { lastName: { [Op.iLike]: `%${q}%` } },
        ],
      };
    }

    const tagInclude = { model: Tag };
    if (activeFilters.includes('tag')) {
      tagInclude.required = true;
      tagInclude.where = { name: { [Op.iLike]: `%${q}%` } };
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

    const includes = [
      { model: Image, as: 'images' },
      userInclude,
      tagInclude,
    ];

    const countIncludes = [
      { model: Image, as: 'images', attributes: [] },
      { ...userInclude, attributes: [] },
      { ...tagInclude, attributes: [] },
    ];

    const where = {
      ...(postConditions.length ? { [Op.or]: postConditions } : {}),
      status: 'active',
    };

    const total = await Post.count({ include: countIncludes, where, distinct: true });
    const totalPages = Math.ceil(total / limit);

    const posts = await Post.findAll({
      include: includes,
      where,
      order,
      limit,
      offset,
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
    res.render('search', { posts, query: q, total, activeFilters, sort, page, totalPages });
  } catch (error) {
    console.error('[!] Error en búsqueda:', error);
    res.render('search', { posts: [], query: q, total: 0, activeFilters, sort, page, totalPages: 0 });
  }
}

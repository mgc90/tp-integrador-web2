import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { User } from "../models/User.js";
import { Tag } from "../models/Tag.js";
import { Follow } from "../models/Follow.js";
import { Op } from "sequelize";

export async function search(req, res) {
  const q = (req.query.q || '').trim();

  if (!q) {
    return res.render('search', { posts: [], query: '', count: 0 });
  }

  try {
    const posts = await Post.findAll({
      include: [
        { model: Image, as: 'images' },
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: Tag },
      ],
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { '$Tags.name$': { [Op.iLike]: `%${q}%` } },
          { '$User.firstName$': { [Op.iLike]: `%${q}%` } },
          { '$User.lastName$': { [Op.iLike]: `%${q}%` } },
        ],
      },
      order: [['createdAt', 'DESC']],
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

    res.render('search', { posts, query: q, count: posts.length });
  } catch (error) {
    console.error('[!] Error en búsqueda:', error);
    res.render('search', { posts: [], query: q, count: 0 });
  }
}

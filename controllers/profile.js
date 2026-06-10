import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { Tag } from "../models/Tag.js";
import { Follow } from "../models/Follow.js";

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
  try {
    const followedUsers = await Follow.findAll({
      where: { followerId: req.session.user.id },
      attributes: ['followedId'],
    });

    const followedIds = followedUsers.map(f => f.followedId);

    if (followedIds.length === 0) {
      return res.render('following', { posts: [] });
    }

    const posts = await Post.findAll({
      include: [
        { model: Tag },
        { model: Image, as: 'images', attributes: ['id', 'url', 'license'] },
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
      ],
      where: { userId: followedIds },
      order: [['createdAt', 'DESC']],
    });

    res.render('following', { posts });
  } catch (error) {
    console.error('[!] Error al cargar posts de seguidos:', error);
    res.render('following', { posts: [] });
  }
}

import { User } from "../models/User.js";
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

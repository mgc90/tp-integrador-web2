import { User } from "../models/User.js";

export async function authMiddleware(req, res, next) {
  const user = req.session.user; // usuario de la sesion solo contiene id
  if(!user) {
    res.redirect('/auth/login');
    return;
  }

  const userId = Number(user.id);

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName'],
    });

    if (!user) {
      res.redirect('/auth/login');
      return;
    }

    res.locals.currentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      rol: 'admin'
    };
  } catch (error) {
    console.error('[!] Error al autenticar usuario:', error);
  }

  next();
}
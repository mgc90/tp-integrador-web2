import { User } from "../models/User.js";

export async function authMiddleware(req, res, next) {
  const user = req.session.user;
  if(!user) {
    res.redirect('/auth/login');
    return;
  }

  const userId = Number(user.id);

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'rol', 'isActive'],
    });

    if (!user || !user.isActive) {
      res.redirect('/auth/login');
      return;
    }

    res.locals.currentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      rol: user.rol,
    };
  } catch (error) {
    console.error('[!] Error al autenticar usuario:', error);
  }

  next();
}

export async function loadCurrentUser(req, res, next) {
  if (!req.session || !req.session.user) return next();

  try {
    const user = await User.findByPk(req.session.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'rol'],
    });

    if (user) {
      res.locals.currentUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        rol: user.rol,
      };
    }
  } catch (error) {
    console.error('[!] Error cargando usuario desde sesión:', error);
  }

  next();
}
export function validatorMiddleware(req, res, next) {
  if (!res.locals.currentUser ||
      (res.locals.currentUser.rol !== 'validator' && res.locals.currentUser.rol !== 'admin')) {
    return res.status(403).render('index', {
      alert: { status: 'error', text: 'Acceso denegado' }
    });
  }
  next();
}

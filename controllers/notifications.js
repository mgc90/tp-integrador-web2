import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Image } from '../models/Image.js';

export async function notify({ userId, type, relatedUserId, postId, imageId }) {
  if (userId === relatedUserId) return;
  await Notification.create({ userId, type, relatedUserId, postId: postId || null, imageId: imageId || null });
}

export async function index(req, res) {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.session.user.id },
      include: [
        { model: User, as: 'actor', attributes: ['id', 'firstName', 'lastName'] },
        { model: Post, attributes: ['id', 'title'] },
        { model: Image, attributes: ['id'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    res.render('notifications/index', { notifications, unreadCount });
  } catch (error) {
    console.error('[!] Error al cargar notificaciones:', error);
    res.redirect('/profile');
  }
}

export async function markAsRead(req, res) {
  try {
    await Notification.update(
      { read: true },
      {
        where: { id: req.params.id, userId: req.session.user.id },
      }
    );
    res.redirect('back');
  } catch (error) {
    console.error('[!] Error al marcar notificación:', error);
    res.redirect('back');
  }
}

export async function markAllAsRead(req, res) {
  try {
    await Notification.update(
      { read: true },
      {
        where: { userId: req.session.user.id, read: false },
      }
    );
    res.redirect('back');
  } catch (error) {
    console.error('[!] Error al marcar notificaciones:', error);
    res.redirect('back');
  }
}

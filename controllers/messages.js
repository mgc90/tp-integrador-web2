import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { Op } from 'sequelize';

export async function index(req, res) {
  const userId = req.session.user.id;

  try {
    const rows = await Message.sequelize.query(`
      SELECT DISTINCT "partnerId" FROM (
        SELECT "receiverId" AS "partnerId" FROM "messages" WHERE "senderId" = :userId
        UNION
        SELECT "senderId" AS "partnerId" FROM "messages" WHERE "receiverId" = :userId
      ) sub
    `, { replacements: { userId }, type: Message.sequelize.QueryTypes.SELECT });

    const partnerIds = rows.map(r => r.partnerId).filter(Boolean);

    const conversations = [];
    for (const partnerId of partnerIds) {
      const lastMessage = await Message.findOne({
        where: {
          [Op.or]: [
            { senderId: userId, receiverId: partnerId },
            { senderId: partnerId, receiverId: userId },
          ],
        },
        order: [['createdAt', 'DESC']],
      });

      const partner = await User.findByPk(partnerId, {
        attributes: ['id', 'firstName', 'lastName'],
      });

      if (partner) {
        const unreadInConversation = await Message.count({
          where: { senderId: partnerId, receiverId: userId, read: false },
        });

        conversations.push({
          partner,
          lastMessage,
          unreadCount: unreadInConversation,
        });
      }
    }

    conversations.sort((a, b) => {
      const aTime = a.lastMessage ? a.lastMessage.createdAt : new Date(0);
      const bTime = b.lastMessage ? b.lastMessage.createdAt : new Date(0);
      return bTime - aTime;
    });

    res.render('messages/inbox', { conversations });
  } catch (error) {
    console.error('[!] Error al cargar conversaciones:', error);
    res.render('messages/inbox', { conversations: [] });
  }
}

export async function chat(req, res) {
  const userId = req.session.user.id;
  const otherUserId = Number(req.params.userId);

  if (userId === otherUserId) return res.redirect('/messages');

  try {
    const partner = await User.findByPk(otherUserId, {
      attributes: ['id', 'firstName', 'lastName'],
    });

    if (!partner) return res.redirect('/messages');

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    await Message.update(
      { read: true },
      { where: { senderId: otherUserId, receiverId: userId, read: false } },
    );

    res.render('messages/chat', { partner, messages, otherUserId });
  } catch (error) {
    console.error('[!] Error al cargar chat:', error);
    res.redirect('/messages');
  }
}

export async function send(req, res) {
  const senderId = req.session.user.id;
  const receiverId = Number(req.params.userId);
  const content = req.body.content;

  if (senderId === receiverId) return res.redirect('/messages');
  if (!content || !content.trim()) return res.redirect('/messages/' + receiverId);

  try {
    await Message.create({
      senderId,
      receiverId,
      content: content.trim(),
    });

    res.redirect('/messages/' + receiverId);
  } catch (error) {
    console.error('[!] Error al enviar mensaje:', error);
    res.redirect('/messages/' + receiverId);
  }
}

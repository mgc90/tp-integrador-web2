import { Follow } from "../models/Follow.js";
import { notify } from "./notifications.js";

export async function toggleFollow(req, res) {
  const followedId = Number(req.params.userId);
  const followerId = req.session.user.id;

  if (followerId === followedId) {
    return res.redirect(req.body.redirect || '/feed');
  }

  try {
    const existing = await Follow.findOne({
      where: { followerId, followedId },
      paranoid: false,
    });

    if (existing) {
      if (existing.deletedAt) {
        await existing.restore();
        await notify({
          userId: followedId,
          type: 'follow',
          relatedUserId: followerId,
        });
      } else {
        await existing.destroy();
      }
    } else {
      await Follow.create({ followerId, followedId });
      await notify({
        userId: followedId,
        type: 'follow',
        relatedUserId: followerId,
      });
    }

    res.redirect(req.body.redirect || '/feed');
  } catch (error) {
    console.error('[!] Error al seguir/dejar de seguir:', error);
    res.redirect(req.body.redirect || '/feed');
  }
}

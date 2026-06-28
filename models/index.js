import sequelize from "./config.js";
import { User } from './User.js';
import { Post } from './Post.js';
import { Image } from './Image.js';
import { Tag } from './Tag.js';
import { Comment } from './Comment.js';
import { Valoration } from './Valoration.js';
import { Interest } from './Interest.js';
import { Follow } from './Follow.js';
import { Collection } from './Collection.js';
import { CollectionPost } from './CollectionPost.js';
import { Notification } from './Notification.js';
import { Report } from './Report.js';
import { Message } from './Message.js';

export function initializeAssociations() {
  User.hasMany(Post, { foreignKey: 'userId' });
  Post.belongsTo(User, { foreignKey: 'userId' });

  Post.hasMany(Image, { foreignKey: 'postId', as: 'images' });
  Image.belongsTo(Post, { foreignKey: 'postId' });

  Post.belongsToMany(Tag, { through: 'PostTag', foreignKey: 'postId' });
  Tag.belongsToMany(Post, { through: 'PostTag', foreignKey: 'tagId' });

  Image.hasMany(Comment, { foreignKey: 'imageId' });
  Comment.belongsTo(Image, { foreignKey: 'imageId' });
  User.hasMany(Comment, { foreignKey: 'userId' });
  Comment.belongsTo(User, { foreignKey: 'userId' });

  Image.hasMany(Valoration, { foreignKey: 'imageId' });
  Valoration.belongsTo(Image, { foreignKey: 'imageId' });
  User.hasMany(Valoration, { foreignKey: 'userId' });
  Valoration.belongsTo(User, { foreignKey: 'userId' });

  Image.hasMany(Interest, { foreignKey: 'imageId' });
  Interest.belongsTo(Image, { foreignKey: 'imageId' });
  User.hasMany(Interest, { foreignKey: 'userId' });
  Interest.belongsTo(User, { foreignKey: 'userId' });

  User.belongsToMany(User, {
    as: 'Followers',
    through: Follow,
    foreignKey: 'followedId',
    otherKey: 'followerId',
  });
  User.belongsToMany(User, {
    as: 'Following',
    through: Follow,
    foreignKey: 'followerId',
    otherKey: 'followedId',
  });

  User.hasMany(Collection, { foreignKey: 'userId' });
  Collection.belongsTo(User, { foreignKey: 'userId' });

  Collection.hasMany(CollectionPost, { foreignKey: 'collectionId' });
  CollectionPost.belongsTo(Collection, { foreignKey: 'collectionId' });

  Post.hasMany(CollectionPost, { foreignKey: 'postId' });
  CollectionPost.belongsTo(Post, { foreignKey: 'postId' });

  Collection.belongsToMany(Post, {
    through: CollectionPost,
    foreignKey: 'collectionId',
    otherKey: 'postId',
  });
  Post.belongsToMany(Collection, {
    through: CollectionPost,
    foreignKey: 'postId',
    otherKey: 'collectionId',
  });

  Notification.belongsTo(User, { foreignKey: 'userId', as: 'recipient' });
  User.hasMany(Notification, { foreignKey: 'userId', as: 'receivedNotifications' });
  Notification.belongsTo(User, { foreignKey: 'relatedUserId', as: 'actor' });
  User.hasMany(Notification, { foreignKey: 'relatedUserId', as: 'triggeredNotifications' });
  Notification.belongsTo(Post, { foreignKey: 'postId' });
  Post.hasMany(Notification, { foreignKey: 'postId' });
  Notification.belongsTo(Image, { foreignKey: 'imageId' });
  Image.hasMany(Notification, { foreignKey: 'imageId' });

  Report.belongsTo(Image, { foreignKey: 'imageId' });
  Image.hasMany(Report, { foreignKey: 'imageId' });
  Report.belongsTo(Comment, { foreignKey: 'commentId' });
  Comment.hasMany(Report, { foreignKey: 'commentId' });
  Report.belongsTo(User, { foreignKey: 'userId', as: 'reporter' });
  User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
  Report.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolver' });

  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
  User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
  User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
}

export async function connectDatabase() {
  try {
    initializeAssociations();
    await sequelize.authenticate();
    console.log('[+] Conexion a bd establecida')
    await sequelize.sync({ alter: true }); // CAMBIAR POR FALSE EN PRODUCCIÓN PARA 
    // EVITAR BORRADO ACCIDENTAL DE COLUMNAS PARA CREAR SÓLO TABLAS QUE NO EXISTEN
    console.log('[+] Sincronizado de modelos')
 
  } catch (error) {
    console.error('[+] Error en la conexion a la bd', error)
    throw error
  }
}

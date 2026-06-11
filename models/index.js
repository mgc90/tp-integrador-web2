import sequelize from "./config.js";
import { User } from './User.js';
import { Post } from './Post.js';
import { Image } from './Image.js';
import { Tag } from './Tag.js';
import { Comment } from './Comment.js';
import { Valoration } from './Valoration.js';
import { Interest } from './Interest.js';
import { Follow } from './Follow.js';

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
}

export async function connectDatabase() {
  try {
    initializeAssociations();
    await sequelize.authenticate();
    console.log('[+] Conexion a bd establecida')
    await sequelize.sync({ alter: false }); // CAMBIAR POR FALSE EN PRODUCCIÓN PARA 
    // EVITAR BORRADO ACCIDENTAL DE COLUMNAS PARA CREAR SÓLO TABLAS QUE NO EXISTEN
    console.log('[+] Sincronizado de modelos')
 
  } catch (error) {
    console.error('[+] Error en la conexion a la bd', error)
    throw error
  }
}

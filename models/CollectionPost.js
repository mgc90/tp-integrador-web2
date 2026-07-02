import { DataTypes } from 'sequelize';
import sequelize from './config.js';

const CollectionPost = sequelize.define('CollectionPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  collectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'collection_posts',
  indexes: [
    {
      unique: true,
      fields: ['collectionId', 'postId'],
    },
  ],
});

export default CollectionPost;
export { CollectionPost };

import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    type: {
      type: DataTypes.ENUM('comment', 'valoration', 'interest', 'follow'),
      allowNull: false,
    },
    relatedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'posts', key: 'id' },
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'images', key: 'id' },
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    createdAt: true,
    updatedAt: true,
  },
);

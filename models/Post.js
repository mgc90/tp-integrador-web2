import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('active', 'taken_down'),
      defaultValue: 'active',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    createdAt: true,
    deletedAt: true,
  },
);

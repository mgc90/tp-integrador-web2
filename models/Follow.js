import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Follow extends Model {}

Follow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    followedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'Follow',
    tableName: 'follows',
    createdAt: true,
    deletedAt: true,
    indexes: [
      { unique: true, fields: ['followerId', 'followedId'] },
    ],
  },
);

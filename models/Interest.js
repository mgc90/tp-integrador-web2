import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Interest extends Model {}

Interest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'images', key: 'id' },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'Interest',
    tableName: 'interests',
    createdAt: true,
    deletedAt: true,
    indexes: [
      { unique: true, fields: ['imageId', 'userId'] },
    ],
  },
);

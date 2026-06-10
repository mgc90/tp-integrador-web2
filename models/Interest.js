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
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Interest',
    tableName: 'interests',
    createdAt: true,
    indexes: [
      { unique: true, fields: ['imageId', 'userId'] },
    ],
  },
);

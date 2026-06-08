import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Tag extends Model {}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags',
    createdAt: true,
    deletedAt: true,
  },
);

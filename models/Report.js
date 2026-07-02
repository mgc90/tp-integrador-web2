import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Report extends Model {}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'images', key: 'id' },
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'comments', key: 'id' },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    motivo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved', 'dismissed'),
      defaultValue: 'pending',
      allowNull: false,
    },
    resolvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Report',
    tableName: 'reports',
    createdAt: true,
    updatedAt: true,
  },
);

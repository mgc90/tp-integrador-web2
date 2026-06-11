import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Image extends Model {}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id' },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
    },
    altText: {
      type: DataTypes.STRING(200),
    },
    license: {
      type: DataTypes.ENUM('copyright', 'no-copyright'),
      allowNull: false,
      defaultValue: 'no-copyright',
    },
    commentsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Image',
    tableName: 'images',
    createdAt: true,
    deletedAt: true,
  },
);

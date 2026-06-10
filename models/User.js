import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";
import bcrypt from 'bcrypt';

export class User extends Model {
  // Metodo para verificar contrasena
  validatePassword(password){
    return bcrypt.compare(password, this.password)
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING, //255
      allowNull: false,
      unique: true,
      validate: {
        isEmail: 'Debe ser un email!'
      }
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: '/imgs/defaultUser.jpg',
    },
    watermarkText: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    }
  },
  {
    sequelize, // necesario para conectarse a la bd
    modelName: 'User', // nombre del modelo
    tableName: 'users', // nombre de la tabla
    createdAt: true, // cada vez que crea un usuario coloca la fecha de creacion
    deletedAt: true, // cada vez que se elimina un usuario coloca la fecha de eliminacion
    hooks: {
      beforeSave: async (usuario) => {
        if(!usuario.password) return;
        if(!usuario.changed('password')) return;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario.password, salt)
        usuario.password = hashedPassword;
      }
    }
  },
);

// user 
// id not null autoincremental
// firstname not null varchar(50)
// lastname not null varchar(50)
// email not null varchar
// -- auditoria
// createdAt
// deletedAt => null | Date para si está activo o no. si es null usuario
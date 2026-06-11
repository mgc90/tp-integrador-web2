import 'dotenv/config';
import { Sequelize } from 'sequelize';

const isNeon = process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  dialectOptions: isNeon ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {},
});

export default sequelize;
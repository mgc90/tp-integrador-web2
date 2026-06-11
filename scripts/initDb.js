import 'dotenv/config';
import sequelize from '../models/config.js';
import { initializeAssociations } from '../models/index.js';

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('[+] Conexión a la base de datos establecida');

    initializeAssociations();

    await sequelize.sync({ alter: true });
    console.log('[+] Tablas sincronizadas correctamente');

    console.log('[+] Base de datos inicializada con éxito.');
  } catch (error) {
    console.error('[!] Error inicializando la base de datos:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

initDatabase();

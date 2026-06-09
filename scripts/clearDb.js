import sequelize from '../models/config.js';
import '../models/User.js';
import '../models/Post.js';
import '../models/Image.js';
import '../models/Tag.js';
import '../models/Comment.js';
import '../models/Valoration.js';
import '../models/Interest.js';
import '../models/Follow.js';

async function clearDatabase() {
  try {
    await sequelize.authenticate();

    const tableNames = Object.values(sequelize.models)
      .map(m => `"${m.tableName}"`)
      .join(', ');

    await sequelize.query(`TRUNCATE TABLE ${tableNames} CASCADE;`);
    console.log('[+] Todos los datos eliminados. Estructura intacta.');
  } catch (error) {
    console.error('[!] Error:', error);
  } finally {
    await sequelize.close();
  }
}

clearDatabase();

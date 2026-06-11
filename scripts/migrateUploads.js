import 'dotenv/config';
import sequelize from '../models/config.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

async function migrateUploads() {
  try {
    await sequelize.authenticate();
    const [images] = await sequelize.query('SELECT id, url FROM images WHERE url LIKE \'/uploads/%\'');

    if (images.length === 0) {
      console.log('[i] No hay imágenes locales para migrar.');
      return;
    }

    console.log(`[+] Migrando ${images.length} imagen(es)...`);

    for (const img of images) {
      const filePath = path.join('public', img.url);
      if (!fs.existsSync(filePath)) {
        console.log(`[!] No se encontró: ${filePath}`);
        continue;
      }

      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'fotaza',
      });

      await sequelize.query(
        'UPDATE images SET url = $1 WHERE id = $2',
        { bind: [result.secure_url, img.id] }
      );

      console.log(`[+] ${img.url} → ${result.secure_url}`);
    }

    console.log('[+] Migración completada.');
  } catch (error) {
    console.error('[!] Error en migración:', error);
  } finally {
    await sequelize.close();
  }
}

migrateUploads();

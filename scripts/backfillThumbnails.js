import 'dotenv/config';
import sequelize from '../models/config.js';
import cloudinary from '../config/cloudinary.js';
import sharp from 'sharp';

async function backfillThumbnails() {
  try {
    await sequelize.authenticate();

    const [images] = await sequelize.query(
      "SELECT id, url FROM images WHERE \"thumbnailUrl\" IS NULL AND url LIKE 'http%'"
    );

    if (images.length === 0) {
      console.log('[i] No hay imágenes sin thumbnail.');
      return;
    }

    console.log(`[+] Generando thumbnails para ${images.length} imagen(es)...`);

    for (const img of images) {
      try {
        const response = await fetch(img.url);
        const buffer = Buffer.from(await response.arrayBuffer());

        const thumbBuffer = await sharp(buffer)
          .resize(200, 200, { fit: 'cover', position: 'centre' })
          .jpeg({ quality: 70 })
          .toBuffer();

        const thumbResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'fotaza/thumbnails' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          stream.end(thumbBuffer);
        });

        await sequelize.query(
          'UPDATE images SET "thumbnailUrl" = $1 WHERE id = $2',
          { bind: [thumbResult.secure_url, img.id] }
        );

        console.log(`[+] #${img.id} thumbnail generado`);
      } catch (err) {
        console.log(`[!] Error en #${img.id}: ${err.message}`);
      }
    }

    console.log('[+] Backfill completado.');
  } catch (error) {
    console.error('[!] Error:', error);
  } finally {
    await sequelize.close();
  }
}

backfillThumbnails();

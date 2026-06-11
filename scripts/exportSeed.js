import 'dotenv/config';
import sequelize from '../models/config.js';
import { initializeAssociations } from '../models/index.js';
import fs from 'fs';

async function exportSeed() {
  await sequelize.authenticate();
  initializeAssociations();

  const tableConfig = [
    { modelName: 'User', varName: 'userRows' },
    { modelName: 'Tag', varName: 'tagRows' },
    { modelName: 'Post', varName: 'postRows' },
    { modelName: 'PostTag', varName: 'postTagRows' },
    { modelName: 'Image', varName: 'imageRows' },
    { modelName: 'Comment', varName: 'commentRows' },
    { modelName: 'Valoration', varName: 'valorationRows' },
    { modelName: 'Interest', varName: 'interestRows' },
    { modelName: 'Follow', varName: 'followRows' },
  ];

  const allData = {};
  for (const { modelName, varName } of tableConfig) {
    const model = sequelize.models[modelName];
    if (!model) {
      console.log(`[!] Modelo ${modelName} no encontrado`);
      allData[varName] = [];
      continue;
    }
    const hasId = model.rawAttributes && model.rawAttributes.id;
    const order = hasId ? [['id', 'ASC']] : [['postId', 'ASC'], ['tagId', 'ASC']];
    const rows = await model.findAll({
      raw: true,
      paranoid: false,
      order,
    });
    allData[varName] = rows;
    console.log(`[+] ${modelName}: ${rows.length} registros`);
  }

  let code = `import sequelize from '../models/config.js';
import { initializeAssociations } from '../models/index.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Image } from '../models/Image.js';
import { Tag } from '../models/Tag.js';
import { Comment } from '../models/Comment.js';
import { Valoration } from '../models/Valoration.js';
import { Interest } from '../models/Interest.js';
import { Follow } from '../models/Follow.js';

`;

  for (const { varName } of tableConfig) {
    const data = allData[varName];
    if (data.length === 0) {
      code += `const ${varName} = [];\n\n`;
    } else {
      code += `const ${varName} = ${JSON.stringify(data, null, 2)};\n\n`;
    }
  }

  code += `async function seed() {
  initializeAssociations();
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userRows.map(({ id, ...rest }) => ({ ...rest })));
  const userIdMap = Object.fromEntries(userRows.map((r, i) => [r.id, users[i].id]));

  const tags = await Tag.bulkCreate(tagRows.map(({ id, ...rest }) => ({ ...rest })));
  const tagIdMap = Object.fromEntries(tagRows.map((r, i) => [r.id, tags[i].id]));

  const posts = await Post.bulkCreate(postRows.map(({ id, ...rest }) => ({
    ...rest,
    userId: userIdMap[rest.userId],
  })));
  const postIdMap = Object.fromEntries(postRows.map((r, i) => [r.id, posts[i].id]));

  if (postTagRows.length > 0) {
    const PostTag = sequelize.models.PostTag;
    await PostTag.bulkCreate(postTagRows.map(({ id, ...rest }) => ({
      ...rest,
      postId: postIdMap[rest.postId],
      tagId: tagIdMap[rest.tagId],
    })));
  }

  const images = await Image.bulkCreate(imageRows.map(({ id, ...rest }) => ({
    ...rest,
    postId: postIdMap[rest.postId],
  })));
  const imageIdMap = Object.fromEntries(imageRows.map((r, i) => [r.id, images[i].id]));

  if (commentRows.length > 0) {
    await Comment.bulkCreate(commentRows.map(({ id, ...rest }) => ({
      ...rest,
      imageId: imageIdMap[rest.imageId],
      userId: userIdMap[rest.userId],
    })));
  }

  if (valorationRows.length > 0) {
    await Valoration.bulkCreate(valorationRows.map(({ id, ...rest }) => ({
      ...rest,
      imageId: imageIdMap[rest.imageId],
      userId: userIdMap[rest.userId],
    })));
  }

  if (interestRows.length > 0) {
    await Interest.bulkCreate(interestRows.map(({ id, ...rest }) => ({
      ...rest,
      imageId: imageIdMap[rest.imageId],
      userId: userIdMap[rest.userId],
    })));
  }

  if (followRows.length > 0) {
    await Follow.bulkCreate(followRows.map(({ id, ...rest }) => ({
      ...rest,
      followerId: userIdMap[rest.followerId],
      followedId: userIdMap[rest.followedId],
    })));
  }

  console.log('[+] Seed completado.');
  await sequelize.close();
}

seed();
`;

  fs.writeFileSync('seeders/seed.js', code, 'utf-8');
  console.log('[+] seeders/seed.js generado correctamente');
  await sequelize.close();
}

exportSeed();

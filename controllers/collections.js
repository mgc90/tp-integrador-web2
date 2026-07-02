import { Collection } from '../models/Collection.js';
import { CollectionPost } from '../models/CollectionPost.js';
import { Post } from '../models/Post.js';
import { Image } from '../models/Image.js';
import { Tag } from '../models/Tag.js';
import { User } from '../models/User.js';
import sequelize from '../models/config.js';
import { createCollectionSchema } from '../validators/collection.js';

export async function index(req, res) {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.session.user.id },
      include: [{ model: CollectionPost, attributes: [] }],
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('CollectionPosts.id')), 'postCount'],
        ],
      },
      group: ['Collection.id'],
      order: [
        ['isDefault', 'DESC'],
        ['name', 'ASC'],
      ],
    });

    res.render('collections/index', { collections });
  } catch (error) {
    console.error('[!] Error al listar colecciones:', error);
    res.redirect('/profile');
  }
}

export async function createForm(req, res) {
  res.render('collections/create');
}

export async function create(req, res) {
  const result = createCollectionSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).render('collections/create', { errors, formValues: req.body });
  }

  try {
    await Collection.create({
      userId: req.session.user.id,
      name: result.data.name,
      description: result.data.description || null,
    });

    res.redirect('/collections');
  } catch (error) {
    console.error('[!] Error al crear colección:', error);
    res.status(500).render('collections/create', {
      alert: { status: 'error', text: 'Error al crear la colección' },
      formValues: req.body,
    });
  }
}

export async function detail(req, res) {
  try {
    const collection = await Collection.findOne({
      where: { id: req.params.id, userId: req.session.user.id },
      include: [{
        model: Post,
        through: { attributes: ['createdAt'] },
        include: [
          { model: Image, as: 'images', attributes: ['id', 'url', 'thumbnailUrl', 'license'] },
          { model: Tag, attributes: ['id', 'name'] },
          { model: User, attributes: ['id', 'firstName', 'lastName'] },
        ],
      }],
      order: [[Post, CollectionPost, 'createdAt', 'DESC']],
    });

    if (!collection) {
      return res.redirect('/collections');
    }

    res.render('collections/detail', { collection });
  } catch (error) {
    console.error('[!] Error al cargar colección:', error);
    res.redirect('/collections');
  }
}

export async function addPost(req, res) {
  try {
    const collection = await Collection.findOne({
      where: { id: req.params.id, userId: req.session.user.id },
    });

    if (!collection) {
      return res.status(404).redirect('/posts/' + req.params.postId);
    }

    await CollectionPost.findOrCreate({
      where: { collectionId: collection.id, postId: req.params.postId },
    });

    res.redirect('/posts/' + req.params.postId);
  } catch (error) {
    console.error('[!] Error al agregar post a colección:', error);
    res.redirect('/posts/' + req.params.postId);
  }
}

export async function removePost(req, res) {
  try {
    const collection = await Collection.findOne({
      where: { id: req.params.id, userId: req.session.user.id },
    });

    if (!collection) {
      return res.status(404).redirect('/posts/' + req.params.postId);
    }

    await CollectionPost.destroy({
      where: { collectionId: collection.id, postId: req.params.postId },
    });

    res.redirect('/posts/' + req.params.postId);
  } catch (error) {
    console.error('[!] Error al remover post de colección:', error);
    res.redirect('/posts/' + req.params.postId);
  }
}

export async function destroy(req, res) {
  try {
    const collection = await Collection.findOne({
      where: { id: req.params.id, userId: req.session.user.id, isDefault: false },
    });

    if (!collection) {
      return res.redirect('/collections');
    }

    await CollectionPost.destroy({ where: { collectionId: collection.id } });
    await collection.destroy();

    res.redirect('/collections');
  } catch (error) {
    console.error('[!] Error al eliminar colección:', error);
    res.redirect('/collections');
  }
}

export async function toggleFavorite(req, res) {
  try {
    const userId = req.session.user.id;
    const postId = req.params.postId;

    let favCollection = await Collection.findOne({
      where: { userId, isDefault: true },
    });

    if (!favCollection) {
      favCollection = await Collection.create({
        userId,
        name: 'Favoritos',
        isDefault: true,
      });
    }

    const existing = await CollectionPost.findOne({
      where: { collectionId: favCollection.id, postId },
    });

    if (existing) {
      await existing.destroy();
    } else {
      await CollectionPost.create({ collectionId: favCollection.id, postId });
    }

    res.redirect('/posts/' + postId);
  } catch (error) {
    console.error('[!] Error al togglear favorito:', error);
    res.redirect('/posts/' + postId);
  }
}

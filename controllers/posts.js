import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { Tag } from "../models/Tag.js";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function detail(req, res) {
  try {
    const post = await Post.findByPk(req.params.postId, {
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: Image, as: 'images',
          include: [
            { model: Comment,
              include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).render('index', {
        alert: { status: 'error', text: 'Publicación no encontrada' }
      });
    }

    res.render('posts/detail', { post });
  } catch (error) {
    console.error('[!] Error al cargar detalle:', error);
    res.status(500).render('index', {
      alert: { status: 'error', text: 'Error al cargar la publicación' }
    });
  }
}

export async function addComment(req, res) {
  const { postId, imageId } = req.params;

  try {
    const post = await Post.findByPk(postId, {
      attributes: ['id', 'commentsEnabled']
    });

    if (!post) {
      return res.status(404).redirect('/');
    }

    if (!post.commentsEnabled) {
      return res.redirect('/posts/' + postId);
    }

    const content = req.body.content && req.body.content.trim();
    if (!content) {
      return res.redirect('/posts/' + postId);
    }

    await Comment.create({
      imageId: Number(imageId),
      userId: req.session.user.id,
      content,
    });

    res.redirect('/posts/' + postId);
  } catch (error) {
    console.error('[!] Error al comentar:', error);
    res.redirect('/posts/' + postId);
  }
}

export async function closeComments(req, res) {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).redirect('/');
    if (!req.session.user || req.session.user.id !== post.userId)
      return res.status(403).redirect('/posts/' + post.id);
    await post.update({ commentsEnabled: false });
    res.redirect('/posts/' + post.id);
  } catch (error) {
    console.error('[!] Error al cerrar comentarios:', error);
    res.redirect('/posts/' + post.id);
  }
}

export async function openComments(req, res) {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).redirect('/');
    if (!req.session.user || req.session.user.id !== post.userId)
      return res.status(403).redirect('/posts/' + post.id);
    await post.update({ commentsEnabled: true });
    res.redirect('/posts/' + post.id);
  } catch (error) {
    console.error('[!] Error al abrir comentarios:', error);
    res.redirect('/posts/' + post.id);
  }
}

export async function createForm(req, res) {
  res.render('posts/new');
}

export async function create(req, res) {
  const { title, description, tags, license1, license2, license3 } = req.body;

  const name = title.trim();
  const descr = description ? description.trim() : '';

  if (!name) {
    return res.status(400).render('posts/new', {
      alert: { status: 'error', text: 'El título es obligatorio' },
      formValues: req.body,
    });
  }

  if (!tags || !tags.trim()) {
    return res.status(400).render('posts/new', {
      alert: { status: 'error', text: 'Al menos una etiqueta es obligatoria' },
      formValues: req.body,
    });
  }

  const images = [];
  for (let i = 1; i <= 3; i++) {
    const file = req.files ? req.files['image' + i] : undefined;
    const license = req.body['license' + i];

    if (file && file[0]) {
      const originalPath = 'public/uploads/' + file[0].filename;
      const ext = path.extname(file[0].filename);
      const newFilename = file[0].filename.replace(ext, '_resized.jpg');
      const newPath = 'public/uploads/' + newFilename;

      const metadata = await sharp(originalPath).metadata();
      const size = Math.min(metadata.width, metadata.height);

      await sharp(originalPath)
        .resize(size, size, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 80 })
        .toFile(newPath);

      fs.unlinkSync(originalPath);

      images.push({ url: '/uploads/' + newFilename, license: license || 'no-copyright' });
    }
  }

  if (images.length === 0) {
    return res.status(400).render('posts/new', {
      alert: { status: 'error', text: 'Debe subir al menos una imagen' },
      formValues: req.body,
    });
  }

  const tagNames = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

  if (tagNames.length === 0) {
    return res.status(400).render('posts/new', {
      alert: { status: 'error', text: 'Ingrese al menos una etiqueta válida' },
      formValues: req.body,
    });
  }

  try {
    const post = await Post.create({
      title: name,
      description: descr,
      userId: req.session.user.id,
    });

    for (const img of images) {
      await Image.create({
        postId: post.id,
        url: img.url,
        license: img.license,
      });
    }

    for (const tagName of tagNames) {
      const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
      await post.addTag(tag);
    }

    res.redirect('/posts/' + post.id);
  } catch (error) {
    console.error('[!] Error al crear publicación:', error);
    res.status(500).render('posts/new', {
      alert: { status: 'error', text: 'Hubo un error al crear la publicación' },
      formValues: req.body,
    });
  }
}

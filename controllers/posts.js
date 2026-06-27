import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { Tag } from "../models/Tag.js";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";
import { Valoration } from "../models/Valoration.js";
import { Interest } from "../models/Interest.js";
import { Follow } from "../models/Follow.js";
import sharp from 'sharp';
import cloudinary from '../config/cloudinary.js';

export async function detail(req, res) {
  try {
    const post = await Post.findByPk(req.params.postId, {
      include: [
        { model: Tag },
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: Image, as: 'images',
          include: [
            { model: Comment,
              include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
            },
            { model: Valoration },
            { model: Interest, attributes: ['userId', 'activo'] },
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).render('index', {
        alert: { status: 'error', text: 'Publicación no encontrada' }
      });
    }

    if (req.session.user && post.User && req.session.user.id !== post.User.id) {
      const follow = await Follow.findOne({
        where: { followerId: req.session.user.id, followedId: post.User.id },
        attributes: ['id'],
      });
      post.User.isFollowing = !!follow;
    } else if (post.User) {
      post.User.isFollowing = false;
    }

    if (req.session.user) {
      const commentAuthorIds = new Set();
      for (const image of post.images) {
        for (const comment of (image.Comments || [])) {
          if (comment.User && comment.User.id !== req.session.user.id) {
            commentAuthorIds.add(comment.User.id);
          }
        }
      }
      if (commentAuthorIds.size) {
        const follows = await Follow.findAll({
          where: { followerId: req.session.user.id, followedId: [...commentAuthorIds] },
          attributes: ['followedId'],
        });
        const followedIds = new Set(follows.map(f => f.followedId));
        for (const image of post.images) {
          for (const comment of (image.Comments || [])) {
            if (comment.User && followedIds.has(comment.User.id)) {
              comment.User.isFollowing = true;
            } else if (comment.User) {
              comment.User.isFollowing = false;
            }
          }
        }
      }
    }

    if (req.session.user) {
      const userId = req.session.user.id;
      for (const image of post.images) {
        const interests = image.Interests || [];
        image.userInterested = interests.some(i => i.userId === userId && i.activo);
        image.activeInterestCount = interests.filter(i => i.activo).length;
      }
    }

    res.render('posts/detail', { post });
  } catch (error) {
    console.error('[!] Error al cargar detalle:', error);
    res.status(500).render('index', {
      alert: { status: 'error', text: 'Error al cargar la publicación' }
    });
  }
}

export async function deleteComment(req, res) {
  const { postId, imageId, commentId } = req.params;

  try {
    const post = await Post.findByPk(postId, { attributes: ['id', 'userId'] });
    if (!post) return res.status(404).redirect('/');
    if (req.session.user.id !== post.userId) return res.status(403).redirect('/posts/' + postId);

    const comment = await Comment.findOne({
      where: { id: commentId, imageId },
      attributes: ['id'],
    });
    if (!comment) return res.status(404).redirect('/posts/' + postId);

    await comment.destroy();
    res.redirect('/posts/' + postId);
  } catch (error) {
    console.error('[!] Error al borrar comentario:', error);
    res.redirect('/posts/' + postId);
  }
}

export async function addComment(req, res) {
  const { postId, imageId } = req.params;

  try {
    const image = await Image.findByPk(imageId, {
      attributes: ['id', 'postId', 'commentsEnabled'],
    });

    if (!image || Number(image.postId) !== Number(postId)) {
      return res.status(404).redirect('/');
    }

    if (!image.commentsEnabled) {
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

export async function rateImage(req, res) {
  const { postId, imageId } = req.params;
  const value = Number(req.body.value);

  if (value < 1 || value > 5) return res.redirect('/posts/' + postId);

  try {
    const post = await Post.findByPk(postId, { attributes: ['userId'] });
    if (!post) return res.status(404).redirect('/');
    if (req.session.user.id === post.userId) return res.redirect('/posts/' + postId);

    const existing = await Valoration.findOne({ where: { imageId, userId: req.session.user.id } });
    if (existing) {
      await existing.update({ value });
    } else {
      await Valoration.create({ imageId: Number(imageId), userId: req.session.user.id, value });
    }

    res.redirect('/posts/' + postId);
  } catch (error) {
    console.error('[!] Error al valorar:', error);
    res.redirect('/posts/' + postId);
  }
}

export async function closeComments(req, res) {
  const { postId, imageId } = req.params;
  try {
    const post = await Post.findByPk(postId, { attributes: ['id', 'userId'] });
    if (!post) return res.status(404).redirect('/');
    if (!req.session.user || req.session.user.id !== post.userId)
      return res.status(403).redirect('/posts/' + postId);
    const image = await Image.findByPk(imageId, { attributes: ['id', 'postId'] });
    if (!image || Number(image.postId) !== Number(postId))
      return res.status(404).redirect('/posts/' + postId);
    await image.update({ commentsEnabled: false });
    res.redirect('/posts/' + postId);
  } catch (error) {
    console.error('[!] Error al cerrar comentarios:', error);
    res.redirect('/posts/' + postId);
  }
}

export async function openComments(req, res) {
  const { postId, imageId } = req.params;
  try {
    const post = await Post.findByPk(postId, { attributes: ['id', 'userId'] });
    if (!post) return res.status(404).redirect('/');
    if (!req.session.user || req.session.user.id !== post.userId)
      return res.status(403).redirect('/posts/' + postId);
    const image = await Image.findByPk(imageId, { attributes: ['id', 'postId'] });
    if (!image || Number(image.postId) !== Number(postId))
      return res.status(404).redirect('/posts/' + postId);
    await image.update({ commentsEnabled: true });
    res.redirect('/posts/' + postId);
  } catch (error) {
    console.error('[!] Error al abrir comentarios:', error);
    res.redirect('/posts/' + postId);
  }
}

export async function toggleInterest(req, res) {
  const { postId, imageId } = req.params;
  const userId = req.session.user.id;

  try {
    const post = await Post.findByPk(postId, { attributes: ['userId'] });
    if (!post) return res.status(404).redirect('/');
    if (post.userId === userId) return res.redirect('/posts/' + postId);

    const [existing, created] = await Interest.findOrCreate({
      where: { imageId: Number(imageId), userId },
      defaults: { activo: true },
    });

    if (!created) {
      await existing.update({ activo: !existing.activo });
    }

    res.redirect('/posts/' + postId);
  } catch (error) {
    console.error('[!] Error al registrar interés:', error);
    res.redirect('/posts/' + postId);
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

  const user = await User.findByPk(req.session.user.id, {
    attributes: ['firstName', 'lastName', 'watermarkText'],
  });
  const watermarkText = user.watermarkText || `${user.firstName} ${user.lastName} - Fotaza`;

  const images = [];
  for (let i = 1; i <= 3; i++) {
    const file = req.files ? req.files['image' + i] : undefined;
    const license = req.body['license' + i];

    if (file && file[0]) {
      const buffer = file[0].buffer;
      const metadata = await sharp(buffer).metadata();
      const size = Math.min(metadata.width, metadata.height);

      let pipeline = sharp(buffer)
        .resize(size, size, { fit: 'cover', position: 'center' });

      if (license === 'copyright') {
        const svg = `
<svg width="${size}" height="${size}">
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="central"
        fill="rgba(255,255,255,0.35)"
        font-size="${Math.max(20, Math.floor(size / 22))}"
        font-family="Arial" font-weight="bold"
        transform="rotate(-30, ${size / 2}, ${size / 2})">
    ${watermarkText}
  </text>
</svg>`;
        pipeline = pipeline.composite([{ input: Buffer.from(svg), top: 0, left: 0 }]);
      }

      const processedBuffer = await pipeline
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbBuffer = await sharp(processedBuffer)
        .resize(200, 200)
        .jpeg({ quality: 70 })
        .toBuffer();

      const [result, thumbResult] = await Promise.all([
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'fotaza' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          stream.end(processedBuffer);
        }),
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'fotaza/thumbnails' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          stream.end(thumbBuffer);
        }),
      ]);

      images.push({
        url: result.secure_url,
        thumbnailUrl: thumbResult.secure_url,
        license: license || 'no-copyright',
      });
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
        thumbnailUrl: img.thumbnailUrl,
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

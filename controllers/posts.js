import { Post } from "../models/Post.js";
import { Image } from "../models/Image.js";
import { Tag } from "../models/Tag.js";

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
      images.push({ url: '/uploads/' + file[0].filename, license: license || 'no-copyright' });
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

    res.redirect('/');
  } catch (error) {
    console.error('[!] Error al crear publicación:', error);
    res.status(500).render('posts/new', {
      alert: { status: 'error', text: 'Hubo un error al crear la publicación' },
      formValues: req.body,
    });
  }
}

import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    cb(null, extOk && mimeOk);
  }
});

const uploadFields = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
]);

export function uploadImages(req, res, next) {
  uploadFields(req, res, (err) => {
    if (err) {
      let text = 'Error al subir archivos';
      if (err.code === 'LIMIT_FILE_SIZE') {
        text = 'Una o más imágenes superan el tamaño máximo de 5MB';
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        text = 'Se recibió un archivo inesperado';
      } else if (err.message) {
        text = err.message;
      }
      return res.status(400).render('posts/new', {
        alert: { status: 'error', text },
        formValues: req.body,
      });
    }
    next();
  });
}

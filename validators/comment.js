import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, 'El comentario no puede estar vacío')
    .max(2000, 'Máximo 2000 caracteres'),
});

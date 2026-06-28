import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio')
    .max(200, 'Máximo 200 caracteres'),
  description: z.string().trim().max(5000, 'Máximo 5000 caracteres').optional(),
  tags: z.string().trim().min(1, 'Al menos una etiqueta es obligatoria')
    .max(500, 'Máximo 500 caracteres'),
});

export const rateSchema = z.object({
  value: z.coerce.number().int().min(1).max(5),
});

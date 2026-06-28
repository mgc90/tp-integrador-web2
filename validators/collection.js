import { z } from 'zod';

const createCollectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export { createCollectionSchema };

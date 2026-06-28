import { z } from 'zod';

const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'El email es obligatorio')
    .max(255, 'Máximo 255 caracteres')
    .email('Email inválido'),
  password: z.string().trim().min(1, 'La contraseña es obligatoria')
    .max(100, 'Máximo 100 caracteres'),
});

export const signupSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio')
    .max(50, 'Máximo 50 caracteres')
    .regex(nameRegex, 'Solo se permiten letras y espacios'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio')
    .max(50, 'Máximo 50 caracteres')
    .regex(nameRegex, 'Solo se permiten letras y espacios'),
  email: z.string().trim().min(1, 'El email es obligatorio')
    .max(255, 'Máximo 255 caracteres')
    .email('Email inválido'),
  password: z.string().trim().min(6, 'Mínimo 6 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  confirmPassword: z.string().trim().min(1, 'Debe confirmar la contraseña')
    .max(100, 'Máximo 100 caracteres'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

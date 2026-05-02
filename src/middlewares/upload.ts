import multer from 'multer';
// @ts-ignore: No type declarations available for this module
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/clodinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'movie-posters',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as object,
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
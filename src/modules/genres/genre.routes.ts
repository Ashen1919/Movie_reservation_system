import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import * as GenreController from './genre.controller.js';
import { validate } from "../../utils/validate.js";
import { createGenreSchema, genreQuerySchema } from "./genre.schema.js";

const genreRoute = Router();

genreRoute.post('/', authenticate, authorize('ADMIN'), validate(createGenreSchema), GenreController.createGenre);
genreRoute.get('/', validate(genreQuerySchema, 'query') ,GenreController.getAllGenres);

export default genreRoute;
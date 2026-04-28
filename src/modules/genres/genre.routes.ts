import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import * as GenreController from './genre.controller.js';

const genreRoute = Router();

genreRoute.post('/', authenticate, authorize('ADMIN'), GenreController.createGenre);
genreRoute.get('/', GenreController.getAllGenres);

export default genreRoute;
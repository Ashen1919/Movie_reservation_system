import { Router } from "express";
import * as MovieController from "./movie.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { upload } from "../../middlewares/upload.js";
import { getShowtimesByMovie } from "../showtimes/showtimes.controller.js";
import { createMovieSchema, movieIdParamSchema, movieQuerySchema, updateMovieSchema } from "./movie.schema.js";

const movieRoutes = Router();

movieRoutes.post('/', authenticate, authorize('ADMIN'), MovieController.createMovie);
movieRoutes.post('/:id/poster', authenticate, authorize('ADMIN'), upload.single('poster'), MovieController.uploadPoster);
movieRoutes.get('/', MovieController.getAllMovies);
movieRoutes.get('/:id/showtimes', getShowtimesByMovie);
movieRoutes.get('/:id', MovieController.getMovieById);
movieRoutes.patch('/:id', authenticate, authorize('ADMIN'), MovieController.updateMovie);
movieRoutes.delete('/:id', authenticate, authorize('ADMIN'), MovieController.deleteMovie);

export default movieRoutes;

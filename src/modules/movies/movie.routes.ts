import { Router } from "express";
import * as MovieController from "./movie.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { upload } from "../../middlewares/upload.js";
import { getShowtimesByMovie } from "../showtimes/showtimes.controller.js";
import { validate } from "../../utils/validate.js";
import { createMovieSchema, movieIdParamSchema, movieQuerySchema, updateMovieSchema } from "./movie.schema.js";

const movieRoutes = Router();

movieRoutes.post('/', authenticate, authorize('ADMIN'), validate(createMovieSchema) ,MovieController.createMovie);
movieRoutes.post('/:id/poster', authenticate, authorize('ADMIN'), upload.single('poster'), MovieController.uploadPoster);
movieRoutes.get('/', validate(movieQuerySchema, 'query') ,MovieController.getAllMovies);
movieRoutes.get('/:id/showtimes', getShowtimesByMovie);
movieRoutes.get('/:id', validate(movieIdParamSchema, 'params') ,MovieController.getMovieById);
movieRoutes.patch('/:id', authenticate, authorize('ADMIN'), validate(updateMovieSchema) ,MovieController.updateMovie);
movieRoutes.delete('/:id', authenticate, authorize('ADMIN'), MovieController.deleteMovie);

export default movieRoutes;

import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import * as ShowtimeController from './showtimes.controller.js';

const showtimeRoutes = Router();

showtimeRoutes.post('/', authenticate, authorize('ADMIN'), ShowtimeController.createShowtime);
showtimeRoutes.patch('/:id', authenticate, authorize('ADMIN'), ShowtimeController.updateShowtime);
showtimeRoutes.get('/seats/:id', authenticate, ShowtimeController.getSeatByShowtime);
showtimeRoutes.delete('/:id', authenticate, authorize('ADMIN'), ShowtimeController.deleteShowtime);

export default showtimeRoutes;
import { Router } from "express";
import * as ReservationController from './reservation.controller.js';
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const reservationRoute = Router();

reservationRoute.use(authenticate);

reservationRoute.post('/lock', ReservationController.lockSeats);
reservationRoute.get('/my', ReservationController.getMyReservations);
reservationRoute.delete('/cancel/:id', ReservationController.cancelReservation);

reservationRoute.get('/', authorize('ADMIN'), ReservationController.getAllReservations);

export default reservationRoute;
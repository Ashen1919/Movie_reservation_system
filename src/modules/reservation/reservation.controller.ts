import type { NextFunction, Request, Response } from "express";
import { confirmReservationSchema, loackSeatsSchema } from "./reservation.schema.js";
import * as ReservationService from './reservation.service.js';

// Lock seats for a showtime
export const lockSeats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { showtimeId, seatIds } = loackSeatsSchema.parse(req.body);
        const userId = (req as any).user!.id;

        const { reservation, lockedUntil } = await ReservationService.lockSeats(
            userId,
            showtimeId,
            seatIds
        );

        res.status(201).json({
            success: true,
            data: {reservation, lockedUntil}
        });
    } catch (err: any) {
        next(err);
    };
};

// confirm reservation after payment
export const confirmReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reservationId } = confirmReservationSchema.parse(req.body);
        const userId = (req as any).user!.id;

        const reservation = await ReservationService.confirmReservation(userId, reservationId);

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (err: any) {
        next(err);
    };
};

// Get my reservations
export const getMyReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user!.id;
        const reservations = await ReservationService.getMyReservations(userId);

        res.status(200).json({
            success: true,
            data: reservations
        });
    } catch (err: any) {
        next(err);
    };
};

// cancel a reservation
export const cancelReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const reservationId = Array.isArray(id) ? id[0] : id;

        if (!reservationId) {
            return res.status(400).json({ success: false, message: 'Reservation ID is required' });
        }

        const userId = (req as any).user!.id;

        const reservation = await ReservationService.cancelReservation(userId, reservationId);

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (err: any) {
        next(err);
    };
};

// get all reservations (admin only)
export const getAllReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const reservations = await ReservationService.getAllReservations(page, limit);
        res.status(200).json({
            success: true,
            data: reservations
        });
    } catch (err: any) {
        next(err);
    };
};
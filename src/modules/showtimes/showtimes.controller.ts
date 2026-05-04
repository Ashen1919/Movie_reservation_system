import type { Request, Response } from 'express';
import * as ShowtimesService from './showtimes.service.js';

// create showtime
export const createShowtime = async (req: Request, res: Response) => {
    try {
        const { movieId, startTime, price, hallName, rows, seatsPerRow } = req.body;
        const showtime = await ShowtimesService.createShowtime({
            movieId,
            startTime: new Date(startTime),
            price: Number(price),
            hallName,
            rows,
            ...(seatsPerRow && { seatsPerRow: Number(seatsPerRow) })
        });
        res.status(201).json({ success: true, data: showtime });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// get showtimes by movie
export const getShowtimesByMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const movieId = Array.isArray(id) ? id[0] : id;

        if (!movieId) {
            return res.status(400).json({ 
                success: false,
                error: "Movie ID is required" 
            });
        }

        const { date } = req.query as { date?: string };

        const showtimes = await ShowtimesService.getShowtimesByMovie(movieId, date);
        res.status(200).json({ success: true, data: showtimes });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// get seats by showtime
export const getSeatByShowtime = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const showtimeId = Array.isArray(id) ? id[0] : id;

        if (!showtimeId) {
            return res.status(400).json({ 
                success: false,
                error: "Showtime ID is required" 
            });
        }

        const seats = await ShowtimesService.getSeatsByMovie(showtimeId);
        res.status(200).json({ success: true, data: seats });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// update showtime
export const updateShowtime = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const showtimeId = Array.isArray(id) ? id[0] : id;

        if (!showtimeId) {
            return res.status(400).json({ 
                success: false,
                error: "Showtime ID is required" 
            });
        }

        const { startTime, price, hallName } = req.body;
        const updatedShowtime = await ShowtimesService.updateShowtime(showtimeId, {
            ...(startTime && { startTime: new Date(startTime) }),
            ...(price && { price: Number(price) }),
            hallName
        });
        res.status(200).json({ success: true, data: updatedShowtime });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// delete showtime
export const deleteShowtime = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const showtimeId = Array.isArray(id) ? id[0] : id;

        if (!showtimeId) {
            return res.status(400).json({ 
                success: false,
                error: "Showtime ID is required" 
            });
        }
        await ShowtimesService.deleteShowtime(showtimeId);
        res.status(200).json({ success: true, message: "Showtime deleted successfully" });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};
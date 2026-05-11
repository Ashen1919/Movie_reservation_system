import prisma from "../../config/db.js";
import redis from "../../config/redis.js";
import { generateSeats } from "../../helpers/generateSeats.js";

// define cache keys
const CACHE_KEYS = {
    showtimesByMovie: (movieId: string, date?: string) => `showtimes:movie:${movieId}:${date ?? 'all' }`,
    seatsByShowtime: (showtimeId: string) => `seats:showtime:${showtimeId}`,
};

// define TTL for cache
const TTL = {
  showtimes: 60,
  seats: 10,
};

// Invalidate cache for showtimes of a movie
const invalidateShowtimesCache = async (movieId: string, showtimeId?: string) => {
    const listKeys = await redis.keys(`showtimes:movie:${movieId}:*`);
    if (listKeys.length) {
        await redis.del(...listKeys);
    }

    if (showtimeId) {
        await redis.del(CACHE_KEYS.seatsByShowtime(showtimeId));
    }
};

// Create showtime for a movie
export const createShowtime = async (data: {
    movieId: string;
    startTime: Date;
    price: number;
    hallName: string;
    rows?: string[];
    seatsPerRow?: number;
}) => {
    // check movie is exist
    const movie = await prisma.movie.findUnique({ where: { id: data.movieId } });
    if (!movie) throw new Error("Movie not found");

    // Calculate end time based on movie duration
    const endTime = new Date(data.startTime.getTime() + movie.durationMinutes * 60 * 1000);

    // check hall overlap
    const overlap = await prisma.showtime.findFirst({
        where: {
            hallName: data.hallName,
            AND: [
                { startTime: { lt: endTime } },
                { endTime: { gt: data.startTime } },
            ],
        },
    });
    if (overlap) throw new Error(`Hall ${data.hallName} is already booked for the given time slot`);

    // generate seats layout
    const rows = data.rows ?? ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const seatsPerRow = data.seatsPerRow ?? 20;
    const totalSeats = rows.length * seatsPerRow;

    // Create showtime 
    const showtime = await prisma.$transaction( async (tx) => {
        const newShowtime = await tx.showtime.create({
            data: {
                movieId: data.movieId,
                startTime: data.startTime,
                endTime,
                price: data.price,
                hallName: data.hallName,
                totalSeats,
                availableSeats: totalSeats,
            },
        });

        // generate and insert all seat rows
        await tx.seat.createMany({
            data: generateSeats(newShowtime.id, rows, seatsPerRow),
        });

        return newShowtime;
    });

    await invalidateShowtimesCache(data.movieId, showtime.id);
    return showtime;
};

// Get showtimes for a movie
export const getShowtimesByMovie = async (movieId: string, date?: string) => {
    // check movie is exist
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) throw new Error("Movie not found");

    // check cache first
    const cacheKey = CACHE_KEYS.showtimesByMovie(movieId, date);
    const cached = await redis.get(cacheKey);

    if (cached) {
        return JSON.parse(cached);
    }

    // build query conditions
    const where: object = {
        movieId,
        ...(date && {
            startTime: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`),
            },
        })
    };
    const showtimes = await prisma.showtime.findMany({ 
        where,
        orderBy: { startTime: 'asc' },
        include: { movie: { select: { title: true, durationMinutes: true } } } 
    });

    // cache the result
    await redis.set(cacheKey, JSON.stringify(showtimes), 'EX', TTL.showtimes);
    return showtimes;
};

// Available seats for showtime
export const getSeatsByMovie = async (showtimeId: string) => {
    // check showtime is exist
    const showtime = await prisma.showtime.findUnique({ where: { id: showtimeId } });
    if (!showtime) throw new Error("Showtime not found");

    // check cache first
    const cacheKey = CACHE_KEYS.seatsByShowtime(showtimeId);
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    const seats = await prisma.seat.findMany({
        where: { showtimeId },
        orderBy: { seatNumber: 'asc' },
    });

    // grouped for better response structure
    const grouped = seats.reduce((acc, seat) => {
        const row = seat.seatNumber.charAt(0);
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
    }, {} as Record<string, typeof seats>);

    const result = {
        showtimeId,
        availableSeats: showtime.availableSeats,
        totalSeats: showtime.totalSeats,
        seats: grouped,
    };

    // cache the result
    await redis.set(cacheKey, JSON.stringify(result), 'EX', TTL.seats);
    return result;
};

// Update showtime details
export const updateShowtime = async (showtimeId: string, data: {
    startTime?: Date;
    price?: number;
    hallName?: string;
}) => {
    // check showtime is exist
    const showtime = await prisma.showtime.findUnique({ where: { id: showtimeId } });
    if (!showtime) throw new Error("Showtime not found");

    // check associated movie is exist
    const movie = await prisma.movie.findUnique({ where: { id: showtime.movieId } });
    if (!movie) throw new Error("Associated movie not found");

    // Calculate new end time based on new start time or existing start time
    const newStartTime = data.startTime ?? showtime.startTime;
    const newHallName = data.hallName ?? showtime.hallName;
    const newEndTime = new Date(newStartTime.getTime() + movie!.durationMinutes * 60 * 1000);

    // If hall or time is changing, check for overlap
    if (data.hallName || data.startTime) {
        // check hall overlap excluding current showtime
        const overlap = await prisma.showtime.findFirst({
            where: {
                id: { not: showtimeId },
                hallName: newHallName,
                AND: [
                    { startTime: { lt: newEndTime } },
                    { endTime: { gt: newStartTime } },
                ],
            },
        });
        if (overlap) throw new Error(`Hall ${newHallName} is already booked for the given time slot`);
    }

    // Update showtime details
    const updated = await prisma.showtime.update({
        where: { id: showtimeId },
        data: {
            startTime: newStartTime,
            endTime: newEndTime,
            price: data.price ?? showtime.price,
            hallName: newHallName,
        },
    });

    await invalidateShowtimesCache(showtime.movieId, showtimeId);
    return updated;
};

// Delete showtime
export const deleteShowtime = async (showtimeId: string) => {
    // check showtime is exist
    const showtime = await prisma.showtime.findUnique({ where: { id: showtimeId } });
    if (!showtime) throw new Error("Showtime not found");
    
    await invalidateShowtimesCache(showtime.movieId, showtimeId);
    await prisma.showtime.delete({ where: { id: showtimeId } });
}
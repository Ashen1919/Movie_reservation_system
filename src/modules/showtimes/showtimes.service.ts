import prisma from "../../config/db.js";
import { generateSeats } from "../../helpers/generateSeats.js";

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

    return showtime;
};

// Get showtimes for a movie
export const getShowtimesByMovie = async (movieId: string, date?: string) => {
    // check movie is exist
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) throw new Error("Movie not found");

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
    return await prisma.showtime.findMany({ 
        where,
        orderBy: { startTime: 'asc' },
        include: { movie: { select: { title: true, durationMinutes: true } } } 
    });
};

// Available seats for showtime
export const getSeatsByMovie = async (showtimeId: string) => {
    // check showtime is exist
    const showtime = await prisma.showtime.findUnique({ where: { id: showtimeId } });
    if (!showtime) throw new Error("Showtime not found");

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

    return {
        showtimeId,
        availableSeats: showtime.availableSeats,
        totalSeats: showtime.totalSeats,
        seats: grouped,
    };
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

    // If hall or time is changing, check for overlap
    if (data.hallName || data.startTime) {
        const newStartTime = data.startTime ?? showtime.startTime;
        const newHallName = data.hallName ?? showtime.hallName;

        const movie = await prisma.movie.findUnique({ where: { id: showtime.movieId } });
        const newEndTime = new Date(newStartTime.getTime() + movie!.durationMinutes * 60 * 1000);

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
    return await prisma.showtime.update({
        where: { id: showtimeId },
        data: {
            startTime: data.startTime ?? showtime.startTime,
            price: data.price ?? showtime.price,
            hallName: data.hallName ?? showtime.hallName,
        },
    });
};

// Delete showtime
export const deleteShowtime = async (showtimeId: string) => {
    // check showtime is exist
    const showtime = await prisma.showtime.findUnique({ where: { id: showtimeId } });
    if (!showtime) throw new Error("Showtime not found");

    await prisma.showtime.delete({ where: { id: showtimeId } });
}
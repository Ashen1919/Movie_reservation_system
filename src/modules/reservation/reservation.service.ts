import prisma from "../../config/db.js";
import type { SeatStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";

const LAOCK_DURATION_MINUTES = 10;

export const lockSeats = async (userId: string, showTimeId: string, seatIds: string[]) => {
    // Implement the logic to lock the seats for the user
    return prisma.$transaction(async (tx) => {
        const lockedRows = await tx.$queryRaw<{id: string; status: SeatStatus; showtime_id: string}[]>`
        SELECT id, status, showtime_id
        FROM "Seat"
        WHERE id = ANY(${seatIds}::uuid[]) AND showtime_id = ${showTimeId}::uuid
        FOR UPDATE
      `;

    // Check if all requested seats are available
    if (lockedRows.length !== seatIds.length) {
        throw new AppError("Some seats are not available", 400);
    };

    // every seats must be available
    const unavailableSeats = lockedRows.filter(seat => seat.status !== "AVAILABLE");
    if (unavailableSeats.length > 0) {
        const ids = unavailableSeats.map(seat => seat.id).join(", ");
        throw new AppError(`The following seats are not available: ${ids}`, 400);
    }

    // price calculation
    const showtime = await tx.showtime.findUnique({ where: { id: showTimeId } });
    if (!showtime) throw new AppError("Showtime not found", 404);
    if (showtime.availableSeats < seatIds.length) {
        throw new AppError("Not enough available seats on this showtime", 400);
    }

    const lockedUntil = new Date(Date.now() + LAOCK_DURATION_MINUTES * 60 * 1000);
    const totalPrice = Number(showtime.price) * seatIds.length;

    // Lock the seats
    await tx.seat.updateMany({
        where: { id: { in: seatIds }},
        data: { status: "LOCKED", lockedUntil }
    });

    // decrease the available seats count
    await tx.showtime.update({
        where: { id: showTimeId },
        data: { availableSeats: { decrement: seatIds.length }}
    });

    const reservation = await tx.reservation.create({
        data: {
            userId,
            showtimeId: showTimeId,
            status: "PENDING",
            totalPrice,
            reservedAt: new Date(),
            ReservationSeat: {
                create: seatIds.map(seatId => ({ seatId }))
            },
        },
        include: {
            ReservationSeat: { include: { seat: true } },
            showtime: { include: { movie: true } }
        }
    });

    return { reservation, lockedUntil };

    });
};
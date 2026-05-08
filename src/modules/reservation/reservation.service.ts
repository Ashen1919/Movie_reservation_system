import prisma from "../../config/db.js";
import { Prisma, type SeatStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";

const LAOCK_DURATION_MINUTES = 10;

export const lockSeats = async (userId: string, showTimeId: string, seatIds: string[]) => {
    // Implement the logic to lock the seats for the user
    return prisma.$transaction(async (tx) => {
        const lockedRows = await tx.$queryRaw<
        { id: string; status: SeatStatus; showtime_id: string }[]
        >(
        Prisma.sql`
            SELECT id, status, showtime_id
            FROM "seats"
            WHERE id IN (${Prisma.join(
            seatIds.map(id => Prisma.sql`${id}::uuid`)
            )})
            AND showtime_id = ${showTimeId}::uuid
            FOR UPDATE
        `
        );

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
            seats: {
                create: seatIds.map(seatId => ({ seatId }))
            },
        },
        include: {
            seats: { include: { seat: true } },
            showtime: { include: { movie: true } }
        }
    });

    return { reservation, lockedUntil };

    });
};

// confirm reservation
export const confirmReservation = async (userId: string, reservationId: string) => {
    return prisma.$transaction(async (tx) => {
        const reservation = await tx.reservation.findUnique({
            where: { id: reservationId },
            include: { seats: { include: { seat: true } } }
        });

        if (!reservation) throw new AppError("Reservation not found", 404);
        if (reservation.userId !== userId) throw new AppError("You do not own this reservation", 403);
        if (reservation.status !== "PENDING") throw new AppError(`Reservation can not be confirmed - current status: ${reservation.status}`, 400);

        // check that non of the locks have already expired
        const seatIds = reservation.seats.map(rs => rs.seatId);
        const now = new Date();
        const expiredSeats = reservation.seats.find(
            (rs) => rs.seat.status !== "LOCKED" || (rs.seat.lockedUntil && rs.seat.lockedUntil < now)
        );

        if (expiredSeats) {
            await prisma.$transaction(async (cleanupTx) => {
                await cleanupTx.seat.updateMany({
                    where: { id: { in: seatIds } },
                    data: { status: "AVAILABLE", lockedUntil: null }
                });

                await cleanupTx.showtime.update({
                    where: { id: reservation.showtimeId },
                    data: { availableSeats: { increment: seatIds.length } }
                });

                await cleanupTx.reservation.update({
                    where: { id: reservationId },
                    data: { status: "EXPIRED" }
                });
            });

            throw new AppError(
                "Seat lock has expired. Please start the booking process again.",
                410
            );
        };

        // update reservation status to RESERVED
        await tx.seat.updateMany({
            where: { id: { in: seatIds } },
            data: { status: "RESERVED", lockedUntil: null }
        });

        // confirm the reservation
        const confirmed = await tx.reservation.update({
            where: { id: reservationId },
            data: { status: 'CONFIRMED' },
            include: {
                seats: { include: { seat: true } },
                showtime: { include: { movie: true } }
            }
        });

        return confirmed;
    });
};

// cancel reservation
export const cancelReservation = async (userId: string, reservationId: string) => {
    return prisma.$transaction(async (tx) => {
        const reservation = await tx.reservation.findUnique({
            where: { id: reservationId },
            include: { seats: true, showtime: true }
        });

        if (!reservation) throw new AppError("Reservation not found", 404);
        if (reservation.userId !== userId) throw new AppError("You do not own this reservation", 403);
        if (reservation.status === "CANCELLED") throw new AppError("Reservation is already canceled", 400);
        if (reservation.status === "EXPIRED") throw new AppError("Reservation is already expired", 400);

        const now = new Date();
        if (reservation.showtime.startTime < now) {
            throw new AppError("Cannot cancel reservation for a showtime that has already started", 400);
        }
        const seatIds = reservation.seats.map(rs => rs.seatId);

        await tx.seat.updateMany({
            where: { id: { in: seatIds } },
            data: { status: "AVAILABLE", lockedUntil: null }
        });

        // increase the available seats count
        if (reservation.status === 'CONFIRMED' || reservation.status === 'PENDING') {
            await tx.showtime.update({
                where: { id: reservation.showtimeId },
                data: { availableSeats: { increment: seatIds.length }}
            });
        };

        const cancelled = await tx.reservation.update({
            where: { id: reservationId },
            data: { status: 'CANCELLED' },
            include: {
                seats: { include: { seat: true } },
                showtime: { include: { movie: true } }
            }
        });
        return cancelled;
    });
};

// get my reservations
export async function getMyReservations(userId: string) {
  return prisma.reservation.findMany({
    where: { userId },
    include: {
      showtime: {
        include: { movie: { include: { genres: { include: { genre: true } } } } },
      },
      seats: { include: { seat: true } },
    },
    orderBy: { reservedAt: 'desc' },
  });
};

// get all reservation (admin)
export const getAllReservations = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [reservations, total] = await prisma.$transaction([
        prisma.reservation.findMany({
            skip,
            take: limit,
            include: {
                user: { select: { id: true, name: true, email: true } },
                showtime: { include: { movie: true } },
                seats: { include: { seat: true } }
            },
            orderBy: { reservedAt: 'desc' }
        }),
        prisma.reservation.count()
    ]);

    return {
        reservations,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
    }
};
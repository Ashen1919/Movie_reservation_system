import Stripe from "stripe";
import { env } from "../config/env.js";
import cron from "node-cron";
import prisma from "../config/db.js";

const stripe = new Stripe(env.stripeSecretKey);

export const startExpiredLockJobs = async () => {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();

            // Find all expired lock seats
            const expiredSeats = await prisma.seat.findMany({
                where: {
                    status: "LOCKED",
                    lockedUntil : { lt: now }
                },
                select: { id: true, showtimeId: true }
            });

            if (expiredSeats.length === 0) return;

            // Group expired seat IDs by showtime
            const seatIdByShowtime = expiredSeats.reduce<Record<string, string[]>>((acc, seat) => {
                if (!acc[seat.showtimeId]) acc[seat.showtimeId] = [];
                acc[seat.showtimeId]!.push(seat.id);
                return acc;
            }, {});

            const expiredSeatIds = expiredSeats.map(seat => seat.id);

            // find PENDING reservations that have these seats
            const reservationsToCancel = await prisma.reservation.findMany({
                where: {
                    status: "PENDING",
                    seats: { every: { seatId: { in: expiredSeatIds } } }
                },
                select: { id: true, paymentIntentId: true }
            });

            // Cancel Stripe payment intents and update reservations and seats
            for (const reservation of reservationsToCancel) {
                if (reservation.paymentIntentId) {
                    try {
                        await stripe.paymentIntents.cancel(reservation.paymentIntentId);
                    } catch (err: any) {
                        console.error(`Failed to cancel payment intent ${reservation.paymentIntentId}:`, err.message);
                    }
                }
            };

            await prisma.$transaction( async (tx) => {
                // Release expired seats
                await tx.seat.updateMany({
                    where: { id: { in: expiredSeatIds } },
                    data: { status: "AVAILABLE", lockedUntil: null }
                });

                // restore available seats count per showtime
                for (const [showtimeId, seatIds] of Object.entries(seatIdByShowtime)) {
                    await tx.showtime.update({
                        where: { id: showtimeId },
                        data: { availableSeats: { increment: seatIds.length } }
                    });
                };

                // mark reservations as EXPIRED
                if (reservationsToCancel.length > 0) {
                    await tx.reservation.updateMany({
                        where: { id: { in: reservationsToCancel.map(r => r.id) } },
                        data: { status: "EXPIRED" }
                    });
                }
            });
        } catch (err: any) {
            console.error("Error occurred while releasing expired locks:", err.message);
        }
    });
};
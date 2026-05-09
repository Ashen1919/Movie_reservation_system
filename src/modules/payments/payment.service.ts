import Stripe from "stripe";
import { env } from "../../config/env.js";
import prisma from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";

const stripe = new Stripe(env.stripeSecretKey);

export const createPaymentIntent = async (userId: string, reservationId: string) => {
    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { showtime: { include: { movie: true } } }
    });

    if (!reservation) throw new AppError("Reservation not found", 404);
    if (reservation.userId !== userId) throw new AppError("Forbidden", 403);
    if (reservation.status !== "PENDING") throw new AppError("Payment already initiated for this reservation", 400);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(reservation.totalPrice) * 100),
        currency: "usd",
        metadata: {
            reservationId: reservation.id,
            userId: reservation.userId
        },
        description: `Payment for reservation ${reservation.id} - ${reservation.showtime.movie.title}`
    });

    await prisma.reservation.update({
        where: { id: reservationId },
        data: { paymentIntentId: paymentIntent.id, }
    });

    return { clientSecret: paymentIntent.client_secret };
};

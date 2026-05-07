import Stripe from "stripe";
import { env } from "../../config/env.js";
import type { Request, Response } from "express";
import { confirmReservation } from "../reservation/reservation.service.js";

const stripe = new Stripe(env.stripeSecretKey);
const webhookSecret = env.stripeWebhookSecret;

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        return res.status(400).send(`Webhook signature verification failed. Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object as Stripe.PaymentIntent;
        const { reservationId, userId } = intent.metadata;

        if (!reservationId || !userId) {
            return res.status(400).send("Missing reservationId or userId in payment intent metadata");
        }

        try {
            await confirmReservation(userId, reservationId);
            res.status(200).send("Reservation confirmed successfully");
        } catch (err: any) {
            console.error("Error confirming reservation:", err);
            res.status(500).send(`Error confirming reservation: ${err.message}`);
        }
    };

    if (event.type === 'payment_intent.payment_failed') {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.warn(`Payment failed for reservation ${intent.metadata.reservationId}: ${intent.last_payment_error?.message}`);
    };

    res.status(200).json({ received: true });
};
import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import { createPaymentIntent } from "./payment.service.js";

export const handlePaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try{
        // Extract userId from authenticated request
        const userId = (req as any).user!.userId;
        const { reservationId } = req.body;

        // Validate input
        if (!reservationId) {
            return res.status(400).json({ 
                success: false,
                message: "Missing reservationId" 
            });
        };
        // Generate idempotency key based on userId and reservationId
        const idempotencyKey = (req.headers['idempotency-key'] as string) || crypto
            .createHash('sha256')
            .update(`${userId}-${reservationId}`)
            .digest('hex');

        // Call the service to create or retrieve the payment intent
        const data = await createPaymentIntent(userId, reservationId, idempotencyKey);

        return res.status(200).json({ 
            success: true,
            data
        });
    } catch (err: any) {
        next(err);
    };
};
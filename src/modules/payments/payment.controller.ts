import type { NextFunction, Request, Response } from "express";
import { success } from "zod";
import { createPaymentIntent } from "./payment.service.js";

export const handlePaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = (req as any).user!.userId;
        const { reservationId } = req.body;

        if (!reservationId) {
            return res.status(400).json({ 
                success: false,
                message: "Missing reservationId" 
            });
        };

        const data = await createPaymentIntent(userId, reservationId);

        return res.status(200).json({ 
            success: true,
            data
        });
    } catch (err: any) {
        next(err);
    };
};
import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../config/jwt.js";
import prisma from "../config/db.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    // get authorization header
    const authHeader = req.headers.authorization;
    // validate token
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided.'
        });
    }

    // verify token
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided.'
        });
    }

    try{
        const payload = verifyAccessToken(token)  as { userId: string, role: string };
        
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { isBlocked: true, isEmailVerified: true }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ success: false, message: 'Your account has been blocked' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ success: false, message: 'Please verify your email to access this resource' });
        }
        
        (req as any).user = payload;
        next();
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};
import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../config/jwt.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
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
        const payload = verifyAccessToken(token);
        (req as any).user = payload;
        next();
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};
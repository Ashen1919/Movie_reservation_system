import type { Request, Response } from "express";
import * as UserService from './users.service.js';

// get profile controller
export const myProfile = async (req: Request, res: Response) => {
    try {
        // get user
        const user = await UserService.myProfile((req as any).user.userId);

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};

// get all users list 
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await UserService.getAllUsers(page, limit);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
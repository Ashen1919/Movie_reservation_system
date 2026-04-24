import type { Request, Response } from "express";
import * as UserService from './users.service.js';

// get profile controller
export const myProfile = async (req: Request, res: Response) => {
    try {
        // check token is available
        const token = req.cookies?.refreshToken;
        if (!token) throw new Error('No token is available!');

        // get user
        const user = await UserService.myProfile(token);

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
}
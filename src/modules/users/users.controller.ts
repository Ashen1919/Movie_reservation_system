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

// Block a user
export const blockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Array.isArray(id) ? id[0] : id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        await UserService.blockUser(userId);

        res.status(200).json({
            success: true,
            message: 'Successfully Blocked the user!'
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Unblock a user
export const unblockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Array.isArray(id) ? id[0] : id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        await UserService.unblockUser(userId);

        res.status(200).json({
            success: true,
            message: 'Successfully unblocked the user!'
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
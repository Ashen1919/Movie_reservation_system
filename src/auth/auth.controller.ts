import type { Request, Response } from "express";
import * as AuthService from './auth.service.js';

// signup controller
export const signup = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        const user = await AuthService.signup(name, email, password);
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// login service
export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const {accessToken, refreshToken} = await AuthService.login(email, password);
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: process.env.NODE_ENV === 'production'});
        res.status(200).json({
            success: true,
            data: accessToken
        });
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: err.message
        });
    }
};

// refresh token controller
export const refresh = async (req: Request, res: Response) => {
    try {
        // check token is available
        const token = req.cookies?.refreshToken;
        if(!token) throw new Error('No refresh token available.');

        // geberate new tokens
        const {accessToken, refreshToken} = await AuthService.refresh(token);
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: process.env.NODE_ENV === 'production'});

        res.status(200).json({
            success: true,
            data: {accessToken}
        });
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: err.message
        });
    }
};

// logout controller
export const logout = async (req: Request, res: Response) => {
    try {
        await AuthService.logout((req as any).user.userId);
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true,
            message: 'Successfully logged out.'
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
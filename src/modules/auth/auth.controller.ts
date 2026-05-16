import type { Request, Response } from "express";
import * as AuthService from './auth.service.js';
import { loginSchema, signUpSchema, verifyEmailSchema } from "./auth.schema.js";

// signup controller
export const signup = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = signUpSchema.parse(req.body);
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
        const {email, password} = loginSchema.parse(req.body);
        const {accessToken, refreshToken} = await AuthService.login(email, password);
        res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production'});
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

        // generate new tokens
        const {accessToken, refreshToken} = await AuthService.refresh(token);
        res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production'});

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
        await AuthService.logout((req as any).user.userId, req.cookies?.refreshToken);
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
};

// verify email controller
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const {token} = req.body;
        if (typeof token !== 'string' || !token) throw new Error('Invalid token');
        await AuthService.verifyEmail(token);
        res.status(200).json({
            success: true,
            message: 'Email verified successfully.'
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// resend verification email controller
export const resendVerificationEmail = async (req: Request, res: Response) => {
    try {
        const {email} = verifyEmailSchema.parse(req.body);
        if (typeof email !== 'string' || !email) throw new Error('Invalid email');
        await AuthService.resendVerificationEmail(email);
        res.status(200).json({
            success: true,
            message: 'Verification email resent successfully.'
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
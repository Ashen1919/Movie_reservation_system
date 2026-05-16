import z from "zod/v3";
import type { verifyEmail } from "./auth.controller.js";

export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name must be at most 50 characters long'),
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(100, 'Password must be at most 100 characters long'),
});

export const loginSchema = z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(100, 'Password must be at most 100 characters long'),
});

export const verifyEmailSchema = z.object({
    email: z.string().email('Please provide a valid email address')
});

export type signUpInput = z.infer<typeof signUpSchema>;
export type loginInput = z.infer<typeof loginSchema>;
export type verifyEmailInput = z.infer<typeof verifyEmailSchema>;
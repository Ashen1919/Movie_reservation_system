import nodemailer from 'nodemailer';
import { env } from './env.js';

export const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: true,
    auth: {
        user: env.smtpUser,
        pass: env.smtpPass
    }
}); 